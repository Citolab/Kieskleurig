import { DomainType, Card as CardType } from '@burgerschap/data';
import React from 'react';
import Badge from '../components/Badge';
import { Card } from '../components/Card';

interface Props {
  cards: CardType[];
  onSelectCard(cardId: string, domain?: DomainType);
}

export const ChooseOne = (props: Props) => {
  const selectedCard = props.cards.find((c) => c.order > 0);

  return (
    <div className="px-4 pb-4">
      <p className="p-3 font-normal">Welke stelling vind je het belangrijkste?</p>
      {props.cards.map((card, i) => (
        <Card
          key={i}
          id="id"
          opposite={i % 2 === 0}
          color={card.themeColor}
          state={selectedCard?.id === card.id ? 'selected' : 'normal'}
          badge={<Badge color={card.themeColor} domain={card.domain}></Badge>}
          onSelect={() => props.onSelectCard(card.id)}
          title={card.title}
        >
          {card.thesis}
        </Card>
      ))}
    </div>
  );
};
