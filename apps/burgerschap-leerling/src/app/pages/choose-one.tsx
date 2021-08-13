import React, { useEffect, useState } from 'react';
import store, {
  ToResultAction,
  ChooseOneCardAction,
} from './cards.store';
import { useHistory } from 'react-router';
import { ChooseOne } from '@burgerschap/ui';

export function ChooseOneCardPage() {
  const [state, setState] = useState(store.currentState());
  const history = useHistory();

  useEffect(() => {
    const subs = store.subscribe(setState);
    // store.dispatch(
    //   new OrderStartAction({ cards: cardInGame, state: OrderState.Personal })
    // );
    return () => subs.unsubscribe();
  }, []);


  return (
    <div>
      {state.cards.find(c => c.order > 0) && (
        <button
          className="btn-primary fixed right-2 bottom-2 z-10"
          onClick={async () => {
            await store.dispatch(new ToResultAction());
            history.push('/wrapup');
          }}
        >
          Klaar
        </button>
      )}
      <ChooseOne
        cards={state.cards}
        onSelectCard={async (cardId) =>
          await store.dispatch(new ChooseOneCardAction({ cardId }))
        }
      ></ChooseOne>
    </div>
  );
}
export default ChooseOneCardPage;
