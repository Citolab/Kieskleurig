import { parseUrl } from '@burgerschap/data';
import { Waiting, WrapUp } from '@burgerschap/ui';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { useHistory } from 'react-router';
import store, { GetReportAction } from './cards.store';

export function WrapupPage() {
  const [state, setState] = useState(store.currentState());

  useEffect(() => {
    const subs = store.subscribe(setState);
    store.dispatch(new GetReportAction());
    return () => subs.unsubscribe();
  }, []);

  if (state.report == null) {
    return (
      <Waiting text="Bedankt voor je mening! Als jouw klasgenoten ook klaar zijn zie je hoe jouw mening verschilt van die van je klasgenoten."></Waiting>
    );
  }
  return (
    <div className="w-full flex flex-wrap">
      <WrapUp cards={state.cards} report={state.report}></WrapUp>
      <button
          className="btn-primary fixed top-2 right-2"
          onClick={() => {
            window.location.href = parseUrl(window.location.href).origin;
          }}
        >
          Afsluiten
        </button>
    </div>
          
  );
}
export default WrapupPage;
