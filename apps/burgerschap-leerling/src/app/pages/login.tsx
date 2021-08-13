import React, { useEffect, useState, useRef } from 'react';
import { Login } from '@burgerschap/ui';
import store, {
  LogoutAction,
  LoginAction,
  LoginSuccessAction,
} from './login.store';
import cardStore, { SetInitialStateAction } from './cards.store';
import { useHistory } from 'react-router-dom';
import { OrderState } from '@burgerschap/data';
import { Dialog } from '@headlessui/react';

export function LoginPage() {
  const [state, setState] = useState(store.currentState());
  const history = useHistory();
  const usedCode = useRef('');
  const [isOpen, setIsOpen] = useState(false);
  const cancelButtonRef = useRef();
  useEffect(() => {
    const subs = store.subscribe(setState);
    return () => subs.unsubscribe();
  }, []);

  const chooseResumeSession = () => (
    <div>
      <div>Je was nog niet helemaal klaar. Wat wil doen?</div>
      <div className="flex justify-between">
        <div>
          <button
            className="w-full mt-4"
            onClick={async () => {
              const state = cardStore.currentState();
              await cardStore.dispatch(
                new SetInitialStateAction({
                  activity: state.activity,
                  user: state.user,
                })
              );
              await store.dispatch(
                new LoginSuccessAction({ userInfo: state.user })
              );
              if (state.orderState === OrderState.group) {
                history.push('/choose');
              } else if (state.orderState === OrderState.sort) {
                history.push('/choose-one');
              }
            }}
          >
            Verder gaan
          </button>
        </div>
        <div>
          <button
            className="w-full mt-4"
            onClick={async () => {
              await store.dispatch(new LogoutAction());
              await store.dispatch(new LoginAction({ code: usedCode.current, force: true }));
              history.push('/intro');
            }}
          >
            Opnieuw beginnen
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Login
        doLogin={async (code) => {
          usedCode.current = code;
          const newState = await store.dispatch(new LoginAction({ code }));
          if (newState.canResume) {
            setIsOpen(true);
          } else if (!newState.loginError) {
            history.push('/intro');
          }
        }}
        errorMessage={state.loginError}
        checking={state.checkingCode}
      />
      {state.canResume && (
        <Dialog
          initialFocus={cancelButtonRef}
          open={isOpen}
          onClose={() => {
            setIsOpen(false);
          }}
          className="fixed z-10 inset-0 overflow-y-auto"
        >
          <div className="min-h-screen px-4 text-center">
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              {chooseResumeSession()}
              {/* <button ref={cancelButtonRef} onClick={() => { setIsOpen(false); setIntroState('home') }}>
              Cancel
            </button> */}
            </div>
          </div>
        </Dialog>
      )}
    </>
  );
}

export default LoginPage;
