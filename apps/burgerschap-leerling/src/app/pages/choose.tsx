import React, { useEffect, useState } from 'react';
import { ChooseCards, Waiting } from '@burgerschap/ui';
import { useHistory } from 'react-router';
import store, {
  ToSortAction,
  UnselectCardAction,
  SelectCardAction,
  UndoConfirmAnswerAction,
  ConfirmAnswerAction,
} from './cards.store';
import {
  ActivityState,
  DomainType,
  OrderState,
  themes,
} from '@burgerschap/data';

export function ChoosePage() {
  const [state, setState] = useState(store.currentState());
  const { push } = useHistory();

  useEffect(() => {
    const subs = store.subscribe(setState);
    return () => subs.unsubscribe();
  }, []);

  useEffect(() => {
    if (state.orderState === OrderState.sort && state.activity.state === ActivityState.sort) {
      store.dispatch(new ToSortAction()).then(_ => push('/choose-one'));
    }
  }, [state, push])

  if (!state.user) {
    return <div></div>;
  }
  if (state.confirmedAnswer || state.orderState === OrderState.sort || state.activity.state === ActivityState.notstarted) {
    return (
      <>
        <Waiting
          text={
            state.activity.state === ActivityState.notstarted
              ? 'Je moet nog heel even wachten tot jouw docent de activiteit heeft gestart.'
              : 'De anderen zijn nog niet klaar. Heel even wachten..'
          }
        ></Waiting>
        <button
          className="btn-primary fixed bottom-6 right-2"
          onClick={() => store.dispatch(new UndoConfirmAnswerAction())}
        >
          Terug
        </button>
      </>
    );
  }
  const currentTheme = themes.find((t) => t.id === state.currentThemeId);
  const selectedCard = state.cards.find((c) => c.themeId === currentTheme.id);
  return (
    <div>
      <ChooseCards
        onUnselectCard={async (cardId) => {
          await store.dispatch(new UnselectCardAction({ cardId }));
        }}
        selectedCard={selectedCard}
        theme={currentTheme}
        onSelectCard={async (cardId: string, domain: DomainType) => {
          await store.dispatch(new SelectCardAction({ cardId, domain }));
        }}
      >
      </ChooseCards>
      {selectedCard && selectedCard.domain && (
        <button
          className={`btn-primary absolute bottom-6 right-2`}
          onClick={async () => {
              await store.dispatch(new ConfirmAnswerAction());
          }}
          disabled={!selectedCard}
        >
          Verder
        </button>
      )}
    </div>
  );
}
export default ChoosePage;
