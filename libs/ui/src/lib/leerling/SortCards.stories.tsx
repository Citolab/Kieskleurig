import React, { useEffect, useState } from 'react';
import { SortCards } from './SortCards';
import { linkTo } from '@storybook/addon-links';
import { withKnobs } from '@storybook/addon-knobs';
import { themes } from '@burgerschap/data';

export default {
  title: 'Leerling/SortCards',
  component: SortCards,
  decorators: [withKnobs],
};

const cardsInLists = {
  cards: themes.map(c => c.cards[0]),
  currentCardIndex: 0,
  orderState: 1,
};

export const Normal = () => {
  const [state, setState] = useState(cardsInLists);

  return (
    <>
      {/* <pre>{ JSON.stringify(state.cards, null, 4)}</pre> */}
      <SortCards
        cards={state.cards}
        onCardChange={(cards) => {
          // action(cards)();
          setState({ ...state, cards });
        }}
      />
      {!state.cards.find((c) => c.order == null) && (
        <button
          className={`
          fixed bottom-2 right-2 m-2 rounded-full flex items-center justify-center p-2 px-3 text-white bg-primary-500 disabled:opacity-50`}
          onClick={() => linkTo('Leerling/ChooseCards')()}
        >
          Klaar
        </button>
      )}
    </>
  );
};
