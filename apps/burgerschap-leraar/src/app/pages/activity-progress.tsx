import { OrderState, parseUrl, themes } from '@burgerschap/data';
import React, { useEffect, useState } from 'react';
import store, {
  ActivityLoadAction,
  ActivityNextCardAction,
  ToSortAction,
} from './activity.store';
import { useHistory } from 'react-router';
import {
  ActivityGroupProgress,
  Waiting
} from '@burgerschap/ui';

export function ActivityProgressPage() {
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

  const currentTheme = themes.find(
    (t) => t.id === state.activity.currentThemeId
  );
  const everythingAnswered = !currentTheme;
  if (everythingAnswered) {
   store.dispatch(new ToSortAction()).then(() =>  history.push(`/result_intro/${state.activity.code}`));
  }
  return (
    <div className="container vh-100 vw-100">
      <div className="flex flex-col">
      <h1 className="absolute left-2 top-5 font-header text-4xl">{state.activity.code}</h1>
        <ActivityGroupProgress
          onNextCard={() => store.dispatch(new ActivityNextCardAction())}
          onGoToResults={() => {
            store.dispatch(new ToSortAction()).then(() =>  history.push(`/result_intro/${state.activity.code}`));
          }}
          activity={state.activity}
          studentStates={state.studentStates.filter(s => s.orderState !== OrderState.aborted)}
        ></ActivityGroupProgress>
      </div>
    </div>
  );
}

export default ActivityProgressPage;
