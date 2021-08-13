import { OrderState } from '@burgerschap/data';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';
import store, {
  ActivityLoadAction,
  StopActivityAction,
} from './activity.store';

export function ResultIntroPage() {
  const history = useHistory();
  const [state, setState] = useState(store.currentState());
  const { code } = useParams<{ code: string }>();
  
  useEffect(() => {
    const subs = store.subscribe(setState);
    if (code) {  
      store.dispatch(
        new ActivityLoadAction({ allowCreateNew: false, activityCode: code })
      );
    }
    return () => subs.unsubscribe();
  }, [code]);
  const noStudentsReady = !state.studentStates.find(
    (s) => s.orderState === OrderState.done
  );
  return (
    <div>
      <div className="flex flex-col items-center mb-24">
        <div className="flex-grow m-8">
          <h1 className="font-header leading-7 text-gray-900 sm:text-3xl sm:truncate mb-4">
            KiesKleurig
          </h1>
          {noStudentsReady ? (
            <div>
              Alle leerlingen kiezen nu een stelling. Ga pas naar het resultaatscherm als alle leerlingen klaar zijn.
            </div>
          ) : !state.studentStates.find(
              (s) => s.orderState !== OrderState.done
            ) ? (
            <div>
              Alle leerlingen zijn klaar. Klik nu op verder om de resultaten te bekijken.
            </div>
          ) : (
            <div>
              {
                state.studentStates.filter(
                  (s) => s.orderState !== OrderState.done
                ).length
              }{' '}
              van de {state.studentStates.length} leerlingen zijn nog bezig. Ga
              pas naar het resultaatscherm als alle leerlingen klaar zijn.
            </div>
          )}
          {!noStudentsReady && (
            <button
              className="btn-primary z-10 mt-5"
              onClick={async () => {
                await store.dispatch(new StopActivityAction());
                history.push(`/result/${state.activity.code}`);
              }}
            >
              Naar resultaten
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
