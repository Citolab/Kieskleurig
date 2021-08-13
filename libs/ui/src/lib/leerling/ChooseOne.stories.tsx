import React, { useEffect, useState } from 'react';
import { linkTo } from '@storybook/addon-links';
import { withKnobs, button } from '@storybook/addon-knobs';
import { ChooseOne } from './ChooseOne';
import { Card, themes } from '@burgerschap/data';

export default {
  title: 'Leerling/ChooseOne',
  component: ChooseOne,
  decorators: [withKnobs],
};

export const Normal = () => {
  const [state, setState] = useState({
    currentThemeId: themes[0].id,
    cards: themes.map((t) => ({ ...t.cards[0] })) as Card[],
  });

  return (
    <div className="h-screen bg-gray-200">
      {/* <pre className="text-xs text-gray-500">{ JSON.stringify(state, null, 4) }</pre> */}
      <ChooseOne
        cards={state.cards}
        onSelectCard={(cardId) => {
          const newCards = state.cards.map(card => ({...card, order: card.id === cardId  ?  1 : 0}));
          setState({ ...state, cards: newCards });
        }}
      ></ChooseOne>
      <button
        onClick={async () => {
          if (state.currentThemeId === themes[themes.length - 1].id) {
            linkTo('Leerling/WrapUp')();
          } else {
            const themeIndex = themes.findIndex(
              (t) => t.id === state.currentThemeId
            );
            setState({ ...state, currentThemeId: themes[1 + themeIndex].id });
          }
        }}
      >
        Verder
      </button>
    </div>
  );
};
