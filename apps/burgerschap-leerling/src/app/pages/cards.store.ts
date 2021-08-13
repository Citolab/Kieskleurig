import firebase from 'firebase/app';
import { Activity, CardsStateModel, DATABASE, UserInfo, themes, OrderState, Card, StudentReport, ActivityState, DomainType } from "@burgerschap/data";
import { createStore, setStoreContext, StateContext, ActionType } from "rx-firebase-store";
import { environment } from "../../environments/environment";

export const initialState: CardsStateModel = {
    cards: [],
    activity: null,
    user: null,
    report: null,
    confirmedAnswer: false,
    orderState: OrderState.group,
    currentThemeId: themes[0].id
};

const activityWatcher = (code: string, ctx: StateContext<CardsStateModel>) => {
    const activityRef = ctx.firestore.doc(DATABASE.ACTIVITY.DOC(code));
    const setData = async (data: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>) => {
        const activity = data.data() as Activity;
        const studentState = ctx.getState();
        await ctx.patchState({ activity });
        if (activity.state === ActivityState.finished && ctx.getState().activity.state !== ActivityState.finished) {
            ctx.dispatch(new GetReportAction());
        }

        if (studentState.confirmedAnswer) {
            const studentCardIndex = themes.findIndex(t => t.id === studentState.currentThemeId);
            const activityCardIndex = themes.findIndex(t => t.id === activity.currentThemeId);
            if (activityCardIndex > studentCardIndex || activity.state === ActivityState.sort) {
                const nextTheme = themes.length > (studentCardIndex + 1) ? themes[studentCardIndex + 1].id : null;
                if (nextTheme === null) {
                    ctx.patchState({ orderState: OrderState.sort });
                } else {
                    ctx.patchState({ currentThemeId: nextTheme, confirmedAnswer: false });
                }
            }
        }
        return ctx.patchState({ activity });
    }
    const unsubscribe = activityRef.onSnapshot(setData, error => ({ error }));
    return unsubscribe;
}

export class UnsubscribeActivityAction implements ActionType<CardsStateModel, never> {
    type = 'UNSUBSCRIBE_ACTIVITY_WATCHER';

    async execute(ctx: StateContext<CardsStateModel>): Promise<CardsStateModel> {
        const prevUnsubscribe = ctx.getContext('unsubscribe') as () => void;
        if (prevUnsubscribe) { prevUnsubscribe(); }
        return ctx.getState();
    }
}

export class SetInitialStateAction implements ActionType<CardsStateModel, { activity: Activity, user: UserInfo, forceReset?:boolean }> {
    type = 'INITIAL_STATE';

    constructor(public payload: { activity: Activity, user: UserInfo,  forceReset?:boolean }) { }

    async execute(ctx: StateContext<CardsStateModel>): Promise<CardsStateModel> {
        if (this.payload.activity) {
            const prevUnsubscribe = ctx.getContext('unsubscribe') as () => void;
            if (prevUnsubscribe) { prevUnsubscribe(); }
            const unsubscribe = activityWatcher(this.payload.activity.code, ctx);
            setStoreContext([{
                name: 'unsubscribe',
                dependency: unsubscribe
            }]);
            const currentState = ctx.getState();
            const state = this.payload.forceReset !== true && currentState.cards?.length > 0 ? currentState : initialState;
            return ctx.setState({ ...state, activity: this.payload.activity, user: this.payload.user });
        }
        return Promise.resolve(ctx.getState());
    }
}


export class RestoreStateAction implements ActionType<CardsStateModel, { init: boolean }> {
    type = 'RESTORE_STATE';
    neverStoreOrLog = true;

    constructor(public payload: { init: boolean }) { }

    async execute(ctx: StateContext<CardsStateModel>): Promise<CardsStateModel> {
        let state = ctx.getState();
        if (state.activity === null) {
            state = await ctx.restoreState();
            if (state.activity && this.payload.init) {
                return ctx.dispatch(new SetInitialStateAction({ activity: state.activity, user: state.user }));
            }
        }
        return Promise.resolve(state);
    }
}

export class GetReportAction implements ActionType<CardsStateModel, never> {
    type = 'GET_REPORT';

    async execute(ctx: StateContext<CardsStateModel>): Promise<CardsStateModel> {
        const state = ctx.getState();
        if (state.activity.state === ActivityState.finished && !state.report) {
            const userIdToken = await ctx.auth.currentUser.getIdToken();
            const response = await ctx.functions.httpsCallable('getStudentReport')(
                {
                    userIdToken,
                    isDev: !environment.production,
                    activityCode: ctx.getState().activity.code
                });
            const report = response.data?.report as StudentReport;
            return ctx.patchState({ report })
        }
        return Promise.resolve(state);
    }
}

export class OrderStartAction implements ActionType<CardsStateModel, { cards: Card[], state: OrderState }> {
    type = 'ORDER_START';

    constructor(public payload: { cards: Card[]; state: OrderState }) { }

    execute(ctx: StateContext<CardsStateModel>): Promise<CardsStateModel> {
        return ctx.patchState({
            cards: this.payload.cards,
            orderState: this.payload.state
        });
    }
}

export class ChooseOneCardAction implements ActionType<CardsStateModel, { cardId: string }> {
    type = 'CARD_CHOOSE_ONE';

    constructor(public payload: { cardId: string }) { }

    execute(ctx: StateContext<CardsStateModel>): Promise<CardsStateModel> {
        const newCards = ctx.getState().cards.map(card => ({...card, order: card.id === this.payload.cardId  ?  1 : 0}));
        return ctx.patchState({
            cards: newCards
        });
    }
}

export class OrderSortAction implements ActionType<CardsStateModel, { cards: Card[] }> {
    type = 'ORDER_SORT';

    constructor(public payload: { cards: Card[] }) { }

    execute(ctx: StateContext<CardsStateModel>): Promise<CardsStateModel> {
        return ctx.patchState({
            cards: this.payload.cards,
        });
    }
}

export class SelectCardAction implements ActionType<CardsStateModel, { cardId: string }> {
    type = 'SELECT_CARD';

    constructor(public payload: { cardId: string, domain: DomainType }) { }

    async execute(ctx: StateContext<CardsStateModel>): Promise<CardsStateModel> {
        const state = ctx.getState();
        const card = themes.find(t => !!t.cards.find(c => c.id === this.payload.cardId))?.cards.find(c => c.id === this.payload.cardId);
        const currentCard = { ...card, domain: this.payload.domain || null };
        const cards = [...state.cards.filter(c => c.themeId !== currentCard.themeId), currentCard];
        return ctx.patchState({ cards });
    }
}

export class ConfirmAnswerAction implements ActionType<CardsStateModel, never> {
    type = 'CONFIRM_ANSWER';

    async execute(ctx: StateContext<CardsStateModel>): Promise<CardsStateModel> {
        const state = ctx.getState();
        const studentCardIndex = themes.findIndex(t => t.id === state.currentThemeId);
        const activityCardIndex = themes.findIndex(t => t.id === state.activity.currentThemeId);

        if (activityCardIndex > studentCardIndex ||
            (studentCardIndex === activityCardIndex && state.activity.state === ActivityState.sort)) {
            const nextTheme = themes.length > (studentCardIndex + 1) ? themes[studentCardIndex + 1].id : null;
            if (nextTheme) {
                return ctx.patchState({ confirmedAnswer: false, currentThemeId: nextTheme });
            } else {
                return ctx.patchState({ confirmedAnswer: false, currentThemeId: null, orderState: OrderState.sort });
            }

        } else {
            return ctx.patchState({ confirmedAnswer: true, currentThemeId: state.activity.currentThemeId });
        }

    }
}

export class UndoConfirmAnswerAction implements ActionType<CardsStateModel, never> {
    type = 'UNDO_CONFIRM_ANSWER';

    async execute(ctx: StateContext<CardsStateModel>): Promise<CardsStateModel> {
        return ctx.patchState({ confirmedAnswer: false });
    }
}

export class UnselectCardAction implements ActionType<CardsStateModel, { cardId: string }> {
    type = 'UNSELECT_CARD';

    constructor(public payload: { cardId: string }) { }

    async execute(ctx: StateContext<CardsStateModel>): Promise<CardsStateModel> {
        const state = ctx.getState();
        const currentCard = themes.find(t => !!t.cards.find(c => c.id === this.payload.cardId))?.cards.find(c => c.id === this.payload.cardId);
        const cards = state.cards.filter(c => c.themeId !== currentCard.themeId);
        return ctx.patchState({ cards });
    }
}

export class ToGroupModusAction implements ActionType<CardsStateModel, never> {
    type = 'TO_GROUP_MODUS_ACTION';

    async execute(ctx: StateContext<CardsStateModel>): Promise<CardsStateModel> {
        return ctx.patchState({
            orderState: OrderState.group,
            currentThemeId: themes[0].id,
            cards: [],
        });
    }
}

export class ToResultAction implements ActionType<CardsStateModel, never> {
    type = 'TO_RESULT_ACTION';

    async execute(ctx: StateContext<CardsStateModel>): Promise<CardsStateModel> {
        return ctx.patchState({
            orderState: OrderState.done
        });
    }
}

export class AbortSessionAction implements ActionType<CardsStateModel, never> {
    type = 'ABORT_SESSION';
    async execute(ctx: StateContext<CardsStateModel>): Promise<CardsStateModel> {
        return ctx.patchState({
            orderState: OrderState.aborted
        });
    }
}

export class ToSortAction implements ActionType<CardsStateModel, never> {
    type = 'TO_SORT_ACTION';
    async execute(ctx: StateContext<CardsStateModel>): Promise<CardsStateModel> {
        const currentState = ctx.getState();
        if (currentState.orderState === OrderState.group) {
            return ctx.patchState({
                orderState: OrderState.sort
            });
        }
        return Promise.resolve(currentState);
    }
}
export const store = createStore<CardsStateModel>(initialState, true, { autoStore: true, addUserId: true, collectionName: environment.production ? 'state' : 'state_dev' });

export default store;