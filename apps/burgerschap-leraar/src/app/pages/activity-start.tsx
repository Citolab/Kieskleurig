import { OrderState, parseUrl } from '@burgerschap/data';
import React, { useEffect, useState } from 'react';
import store, {
  ActivityLoadAction,
  ActivityStartGroupAction,
  StopActivityAction,
} from './activity.store';
import { useHistory } from 'react-router';
import { Waiting } from '@burgerschap/ui';
export function StartActivityPage() {
  const history = useHistory();
  const [state, setState] = useState(store.currentState());

  useEffect(() => {
    const subs = store.subscribe((state) => {
      setState(state);
    });
    store.dispatch(new ActivityLoadAction());
    return () => subs.unsubscribe();
  }, []);
  if (state.loading) {
    return <Waiting></Waiting>;
  }
  const studentCount = state.studentStates.filter(
    (s) => s.orderState !== OrderState.aborted
  ).length;
  return (
    <div className="h-screen w-screen">
      <button
        className="btn-primary fixed top-2 left-2  z-10"
        onClick={async () => {
          await store.dispatch(new StopActivityAction());
          const parsedUrl = parseUrl(window.location.href);
          window.location.href = parsedUrl.origin;
        }}
      >
        Stoppen
      </button>
      {state.studentStates.length > 0 && (
        <button
          className="btn-primary fixed top-2 right-2"
          onClick={async () => {
            await store.dispatch(new ActivityStartGroupAction());
            history.push('/activity');
          }}
        >
          Start activiteit
        </button>
      )}
      <div className="h-full flex flex-col items-center justify-center">
        <div className="mb-8 text-xl">Voer deze code in:</div>
        <h1 className="font-header text-4xl">{state.activity.code}</h1>
        <div className="mt-8 text-xl">
          {studentCount === 0 ? (
            <div>Er zijn nog geen leerlingen ingelogd.</div>
          ) : studentCount === 1 ? (
            <div>Er is 1 leerling ingelogd.</div>
          ) : (
            <div>Er zijn {studentCount} leerlingen ingelogd.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StartActivityPage;
