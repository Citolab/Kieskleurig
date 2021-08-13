import React, { useEffect, useState } from 'react';
import { linkTo } from '@storybook/addon-links';
import { withKnobs, button } from '@storybook/addon-knobs';
import { ChooseCards } from './ChooseCards';
import { Card, themes } from '@burgerschap/data';

export default {
  title: 'Leerling/ChooseCards',
  component: ChooseCards,
  decorators: [withKnobs],
};

export const Normal = () => {
  const [state, setState] = useState({
    currentThemeId: themes[0].id,
    cards: [] as Card[],
  });

  const currentTheme = themes.find((t) => t.id === state.currentThemeId);
  const selectedCard = state.cards.find((c) => c.themeId === currentTheme.id);
  return (
    <div className="h-screen bg-gray-200">
      {/* <pre className="text-xs text-gray-500">{ JSON.stringify(state, null, 4) }</pre> */}
      <ChooseCards
        theme={currentTheme}
        selectedCard={selectedCard}
        onSelectCard={(cardId) => {
          const currentCard = themes
            .find((t) => !!t.cards.find((c) => c.id === cardId))
            ?.cards.find((c) => c.id === cardId);
          const cards = [
            ...state.cards.filter((c) => c.themeId !== currentCard.themeId),
            currentCard,
          ];
          setState({ ...state, cards });
        }}
        onUnselectCard={(cardId) => {
          const currentCard = themes
            .find((t) => !!t.cards.find((c) => c.id === cardId))
            ?.cards.find((c) => c.id === cardId);
          const cards = state.cards.filter(
            (c) => c.themeId !== currentCard.themeId
          );
          setState({ ...state, cards });
        }}
      >
      </ChooseCards>
      <button
        onClick={async () => {
          if (state.currentThemeId === themes[themes.length - 1].id) {
            linkTo('Leerling/ChooseOneCard')();
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
