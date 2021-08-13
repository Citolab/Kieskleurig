import { Activity, DATABASE, teacherTypes, ActivityState, Theme, CardsStateModel, themes } from '@burgerschap/data';
import { environment } from '../../environments/environment';
import firebase from "firebase/app";
import { StateContext, createStore, setStoreContext, ActionType, SyncOptions } from 'rx-firebase-store';

export interface ActivityStateModel {
    loading: boolean;
    themes: Theme[];
    activity: Activity;
    user: firebase.User;
    isLastTheme: boolean;
    studentStates: CardsStateModel[];
    creatingActivity: boolean,
}

const initialState: ActivityStateModel = {
    loading: true,
    activity: null,
    themes: themes,
    user: null,
    studentStates: [],
    creatingActivity: false,
    isLastTheme: false
};


const studentWatcher = (userId: string, code: string, ctx: StateContext<ActivityStateModel>) => {
    const studentCollection = ctx.firestore.collection(DATABASE.TEACHER.ACTIVITY.STUDENT.COLLECTION(userId, code));
    const unsubscribe = studentCollection.onSnapshot(
        (data) => {
            const studentStates = data.docs.map((d) => d.data() as CardsStateModel);
            return ctx.patchState({ studentStates })
        },
        error => ({ error }),
    );
    return unsubscribe;
}

export class LoginSuccessAction implements ActionType<ActivityStateModel, { user: firebase.User }> {
    type = teacherTypes.LOGIN.SUCCESS;
    constructor(public payload: { user: firebase.User }) { }

    execute(ctx: StateContext<ActivityStateModel>): Promise<ActivityStateModel> {
        return ctx.patchState({
            user: this.payload.user
        });
    }
}

export class LogoutAction implements ActionType<ActivityStateModel, never> {
    type = teacherTypes.LOGIN.LOGOUT;

    execute(ctx: StateContext<ActivityStateModel>): Promise<ActivityStateModel> {
        return ctx.patchState({
            user: null
        });
    }
}

export class UnsubscribeStudentWatcherAction implements ActionType<ActivityStateModel, never> {
    type = 'UNSUBSCRIBE_STUDENT_WATCHER';

    async execute(ctx: StateContext<ActivityStateModel>): Promise<ActivityStateModel> {
        const prevUnsubscribe = ctx.getContext('unsubscribe') as () => void;
        if (prevUnsubscribe) { prevUnsubscribe(); }
        return ctx.getState();
    }
}

export class StopActivityAction implements ActionType<ActivityStateModel, never> {
    payload: never;
    type = teacherTypes.ACTIVITY.FINISH;
    async execute(ctx: StateContext<ActivityStateModel>): Promise<ActivityStateModel> {
        const activity = {
            ...ctx.getState().activity,
            state: ActivityState.finished
        };
        const ret = ctx.patchState({ activity });
        await ctx.firestore.doc(DATABASE.ACTIVITY.DOC(activity.code)).set(activity);
        return ret;
    }
}

export class ActivityLoadAction implements ActionType<ActivityStateModel, { allowCreateNew: boolean, activityCode: string }> {
    type = teacherTypes.ACTIVITY.LOAD;

    constructor(public payload: { allowCreateNew: boolean, activityCode: string } = { allowCreateNew: true, activityCode: '' }) { }

    async execute(ctx: StateContext<ActivityStateModel>): Promise<ActivityStateModel> {
        if (!ctx.getState().activity) {
            ctx.patchState({ loading: true, creatingActivity: true });
            const userId = ctx.getState().user.uid;
            let activity: Activity = null;
            if (this.payload.allowCreateNew) {
                activity = ((await ctx.functions.httpsCallable('getOrCreateActivity')({ userId }))?.data?.activity as Activity);
            } else {
                activity = (await (ctx.firestore.doc(`/teacher/${userId}/activity/${this.payload.activityCode}`).get())).data() as Activity;
            }

            // subscribe for changes.
            const prevUnsubscribe = ctx.getContext('unsubscribe') as () => void;
            if (prevUnsubscribe) { prevUnsubscribe(); }
            const unsubscribe = studentWatcher(userId, activity?.code || this.payload.activityCode, ctx);
            setStoreContext([{
                name: 'unsubscribe',
                dependency: unsubscribe
            }]);
            return ctx.setState({
                ...initialState,
                loading: false,
                creatingActivity: false,
                activity
            });
        } else {
            return Promise.resolve(ctx.getState());
        }

    }
}

export class ActivityStartGroupAction implements ActionType<ActivityStateModel, never> {
    type = teacherTypes.ACTIVITY.START_GROUP;

    async execute(ctx: StateContext<ActivityStateModel>): Promise<ActivityStateModel> {
        const activity = {
            ...ctx.getState().activity,
            state: ActivityState.group,
            currentThemeId: ctx.getState().themes[0].id
        };
        const ret = ctx.patchState({ activity });
        await ctx.firestore.doc(DATABASE.ACTIVITY.DOC(activity.code)).set(activity);
        return ret;
    }
}

export class ToSortAction implements ActionType<ActivityStateModel, never> {
    type = teacherTypes.ACTIVITY.SORT;

    async execute(ctx: StateContext<ActivityStateModel>): Promise<ActivityStateModel> {
        const activity = {
            ...ctx.getState().activity,
            state: ActivityState.sort
        };
        const ret = ctx.patchState({ activity });
        await ctx.firestore.doc(DATABASE.ACTIVITY.DOC(activity.code)).set(activity);
        return ret;
    }
}


export class ActivityNextCardAction implements ActionType<ActivityStateModel, never> {
    type = teacherTypes.ACTIVITY.NEXT_CARD;

    async execute(ctx: StateContext<ActivityStateModel>): Promise<ActivityStateModel> {
        const state = ctx.getState();
        const currentThemeId = state.activity.currentThemeId;
        const currentIndex = themes.findIndex(c => c.id === currentThemeId);
        const nextThemeId = themes.length > (currentIndex + 1) ?
            themes[currentIndex + 1].id : null;
        const isLastTheme = currentIndex + 2 === themes.length;
        const activity = { ...ctx.getState().activity, currentThemeId: nextThemeId };
        const ret = ctx.patchState({ activity, isLastTheme });
        await ctx.firestore.doc(DATABASE.ACTIVITY.DOC(activity.code)).set(activity);
        return ret;
    }
}

const store = createStore<ActivityStateModel>(initialState, !environment.production, { autoStore: false, logAction: false } as SyncOptions);
export default store;