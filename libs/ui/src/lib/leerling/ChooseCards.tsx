import { DomainType, Theme, Card as CardType } from '@burgerschap/data';
import React from 'react';
import Badge from '../components/Badge';
import { Card } from '../components/Card';

import {
  EcologieInfo,
  EconomieInfo,
  SamenlevingInfo,
} from '../components/DomainInfo';

interface Props {
  theme: Theme;
  selectedCard: CardType;
  onSelectCard(cardId: string, domain?: DomainType);
  onUnselectCard(cardId: string);
  children?: unknown;
}

export const ChooseCards = (props: Props) => {
  const {
    theme,
    selectedCard,
    onUnselectCard: onUnSelectCard,
    children,
  } = props;
  return (
    <>
      <div className="bg-white p-4">
        <h1 className="h2 font-header">{props.theme?.title}</h1>
        {/* <p className="font-normal">{props.theme?.description}</p> */}
        <p className="font-normal">Maak een keuze</p>
      </div>
      <div className="mt-4">{children}</div>
      <div className="px-4 pb-4">
        {theme?.cards.map((cardDefinition, i) => (
          (!selectedCard || cardDefinition.id === selectedCard.id) && 
          <Card
            key={i}
            id="id"
            opposite={i % 2 === 0}
            color={theme.themeColor}
            state={
              selectedCard?.id === cardDefinition.id ? 'selected' : 'normal'
            }
            badge={
              <Badge color={theme.themeColor} domain={cardDefinition.domain}></Badge>
            }
            onSelect={() => props.onSelectCard(cardDefinition.id)}
            // title={cardDefinition.title}
          >
            {cardDefinition.thesisShort}
          </Card>
        ))}
      </div>
      {selectedCard && (
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-white px-4 pt-4 rounded-t-2xl">
          <div className="flex flex-col">
            <p className="mb-1 font-bold">Waarom kies je deze stelling? </p>
            <p className="mb-2">omdat het goed is voor de</p>
          </div>

          <button
          className={`btn-primary border-primary border-2 bg-white text-primary absolute bottom-6 left-2`}
          onClick={() => props.onUnselectCard(selectedCard.id)}
          disabled={!selectedCard}
        >
          Terug
        </button>

          <div
            style={{
              backgroundColor:
                selectedCard.domain === 'ecologie' ? theme.themeColor : 'none',
              color: selectedCard.domain === 'ecologie' ? 'white' : 'none',
            }}
            className="rounded-full px-2"
          >
            <EcologieInfo
                        showGoodFor={false}

              onClick={() => props.onSelectCard(selectedCard.id, 'ecologie')}
            />
          </div>
          <div
            style={{
              backgroundColor:
                selectedCard.domain === 'economie' ? theme.themeColor : 'none',
              color: selectedCard.domain === 'economie' ? 'white' : 'none',
            }}
            className="rounded-full px-2"
          >
            <EconomieInfo
                        showGoodFor={false}

              onClick={() => props.onSelectCard(selectedCard.id, 'economie')}
            />
          </div>
          <div
            style={{
              backgroundColor:
                selectedCard.domain === 'samenleving'
                  ? theme.themeColor
                  : 'none',
              color: selectedCard.domain === 'samenleving' ? 'white' : 'none',
            }}
            className="rounded-full px-2"
          >
            <SamenlevingInfo
            showGoodFor={false}
              onClick={() => props.onSelectCard(selectedCard.id, 'samenleving')}
            />
          </div>
        </div>
      )}
    </>
  );
};
