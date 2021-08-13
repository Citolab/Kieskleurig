import { OrderState, parseUrl } from '@burgerschap/data';
import { GroupResult } from '@burgerschap/ui';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import store, {
  ActivityLoadAction,
  StopActivityAction,
} from './activity.store';

export function ResultPage() {
  const { code } = useParams<{ code: string }>();
  const [state, setState] = useState(store.currentState());

  useEffect(() => {
    const subs = store.subscribe(setState);
    if (code) {
      store.dispatch(
        new ActivityLoadAction({ allowCreateNew: false, activityCode: code })
      );
    }
    return () => subs.unsubscribe();
  }, [code]);

  return (
    <div>
      <button
        className="btn-primary fixed top-2 right-2  z-10"
        onClick={async () => {
          await store.dispatch(new StopActivityAction());
          const parsedUrl = parseUrl(window.location.href);
          window.location.href = parsedUrl.origin;
        }}
      >
        Stoppen
      </button>
      <div>
        <GroupResult
          activity={state.activity}
          studentStates={state.studentStates.filter(
            (s) => s.orderState === OrderState.done
          )}
        />
      </div>
    </div>
  );
}
export default ResultPage;
