import { studentTypes, setUserInfo, UserInfo, Activity, OrderState } from '@burgerschap/data';
import { environment } from '../../environments/environment';
import firebase from "firebase/app";
import sortStore, { RestoreStateAction, SetInitialStateAction } from './cards.store';
import { StateContext, createStore, ActionType } from 'rx-firebase-store';
import cardStore, { initialState as cardInitialState } from './cards.store';
export interface LoginStateModel {
    code: string;
    user: UserInfo;
    loginError: string;
    loading: boolean;
    checkingCode: boolean;
    canLogin: boolean;
    canResume: boolean;
}

const initialState: LoginStateModel =
{
    code: '',
    user: null,
    loginError: '',
    loading: true,
    checkingCode: false,
    canLogin: false,
    canResume: false
};


export class LoginSuccessAction implements ActionType<LoginStateModel, { userInfo: UserInfo }> {
    type = studentTypes.LOGIN.SUCCESS

    constructor(public payload: { userInfo: UserInfo }) { }

    async execute(ctx: StateContext<LoginStateModel>): Promise<LoginStateModel> {
        return ctx.patchState({
            code: '',
            loading: false,
            user: this.payload.userInfo
        });
    }
}

export class AutoLoginFailAction implements ActionType<LoginStateModel, never> {
    type = studentTypes.LOGIN.SUCCESS;

    execute(ctx: StateContext<LoginStateModel>): Promise<LoginStateModel> {
        return ctx.patchState({
            code: '',
            loading: false,
            user: null
        });
    }
}

export class LogoutAction implements ActionType<LoginStateModel, never> {
    type = studentTypes.LOGOUT.REQUEST;

    async execute(ctx: StateContext<LoginStateModel>): Promise<LoginStateModel> {
        await ctx.auth.signOut();
        return ctx.patchState({
            code: '',
            loading: false,
            user: null
        })
    }
}

export class LoginAction implements ActionType<LoginStateModel, { code: string, force?: boolean }> {
    type = 'LOGIN';
    constructor(public payload: { code: string, force?: boolean }) { }

    async execute(ctx: StateContext<LoginStateModel>): Promise<LoginStateModel> {
        let { code } = this.payload;
        code = code.toUpperCase().trim();
        await ctx.auth.signInAnonymously();
        ctx.patchState({
            code,
            checkingCode: true,
            user: null,
            loginError: ''
        });

        if (ctx.auth.currentUser) {// && ctx.auth.currentUser.displayName
            if (this.payload.force !== true) {
                await cardStore.dispatch(new RestoreStateAction({ init: false }));
            }
            const prevState = this.payload.force === true ? cardInitialState : cardStore.currentState();

            if (prevState && prevState.activity?.code === code && (prevState.orderState !== OrderState.done && prevState.orderState !== OrderState.aborted)) {
                return ctx.patchState({ canResume: true });
            } else if (prevState) {
                // logout first otherwise you could get the same id for a different user on the same device.
                await ctx.auth.signOut();
            }
        }
        // sign-in before the code is checked because then the uid can be used to setup things
        // in the checkCode function.
        let user: firebase.User;
        try {
            user = (await ctx.auth.signInAnonymously()).user;
        } catch {
            console.error('cannot login');
        }
        //const code = action.payload;
        const checkCode = async () => {
            return ((await ctx.functions.httpsCallable('checkCode')({ userId: ctx.auth.currentUser.uid, code }))?.data) as { activity: Activity, avatarIndex: number };
        }
        let activity: Activity;
        const loginCode = code;
        try {
            const result = await checkCode();
            if (result.activity) {
                activity = result.activity;
            } else {
                return ctx.patchState({
                    code: loginCode,
                    loading: false,
                    checkingCode: false,
                    user: null,
                    loginError: 'Onbekende code'
                });
            }
        } catch (error) {
            return ctx.patchState({
                code: loginCode,
                loading: false,
                checkingCode: false,
                user: null,
                loginError: 'Onbekende code'
            });
        }
        if (activity) {
            if (user) {
                // TODO: check state to restore.
                const userInfo = await setUserInfo(user, loginCode, activity.createdBy, "", false);
                const newState = await ctx.dispatch(new LoginSuccessAction({ userInfo }));
                await sortStore.dispatch(new SetInitialStateAction({ activity, user: userInfo, forceReset: true }));
                ctx.patchState({ checkingCode: false });
                return newState;
            }
        }
    }
}


const store = createStore<LoginStateModel>(initialState, !environment.production, { addUserId: false, autoStore: false, logAction: false });

export default store;