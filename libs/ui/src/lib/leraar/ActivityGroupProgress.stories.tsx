import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import {
  Activity,
  ActivityState,
  Card,
  CardsStateModel,
  OrderState,
  themes,
} from '@burgerschap/data';
import { ActivityGroupProgress } from './ActivityGroupProgress';

export default {
  title: 'Leraar/ActivityGroupProgress',
  component: ActivityGroupProgress,
  decorators: [withKnobs],
};

const activity: Activity = {
  code: 'ABCDE',
  currentThemeId: themes[0].id,
  state: ActivityState.notstarted,
} as Activity;

export const noAnswers = () => {
  const studentStates = Array(10)
    .fill('')
    .map((_, index) => {
      return {
        activity: activity,
        currentThemeId: themes[0].id,
        cards: [],
        user: null,
      } as CardsStateModel;
    });
  return (
    <div>
      {/* <pre className="text-xs text-gray-500">{ JSON.stringify(state, null, 4) }</pre> */}
      <ActivityGroupProgress
        onGoToResults={() => console.log('go to results')}
        onNextCard={() => console.log('next card')}
        activity={activity}
        studentStates={studentStates}
      />
    </div>
  );
};

export const oneAnswer = () => {
  const studentStates = Array(10)
    .fill('')
    .map((_, index) => {
      const card: Card = { ...themes[0].cards[0], domain: 'ecologie' };
      return {
        activity: activity,
        currentThemeId: themes[0].id,
        cards: index === 0 ? [card] : [],
        user: null,
      } as CardsStateModel;
    });
  return (
    <div>
      {/* <pre className="text-xs text-gray-500">{ JSON.stringify(state, null, 4) }</pre> */}
      <ActivityGroupProgress
        onGoToResults={() => console.log('go to results')}
        onNextCard={() => console.log('next card')}
        activity={activity}
        studentStates={studentStates}
      />
    </div>
  );
};

export const zero100Answer = () => {
  const studentStates = Array(10)
    .fill('')
    .map((_, index) => {
      const card: Card = { ...themes[0].cards[0], domain: 'ecologie' };
      return {
        activity: activity,
        currentThemeId: themes[0].id,
        cards: [card],
        user: null,
      } as CardsStateModel;
    });
  return (
    <div>
      {/* <pre className="text-xs text-gray-500">{ JSON.stringify(state, null, 4) }</pre> */}
      <ActivityGroupProgress
        onGoToResults={() => console.log('go to results')}
        onNextCard={() => console.log('next card')}
        activity={activity}
        studentStates={studentStates}
      />
    </div>
  );
};

export const FortySixtyAnswer = () => {
  const studentStates = Array(10)
    .fill('')
    .map((_, index) => {
      const card: Card = { ...themes[0].cards[index < 4 ? 0 : 1], domain: index < 2 ? 'ecologie' : index < 6 ? 'economie' : 'samenleving'};
      return {
        activity: activity,
        currentThemeId: themes[0].id,
        cards: [card],
        user: null,
      } as CardsStateModel;
    });
  return (
    <div>
      {/* <pre className="text-xs text-gray-500">{ JSON.stringify(state, null, 4) }</pre> */}
      <ActivityGroupProgress
        onGoToResults={() => console.log('go to results')}
        onNextCard={() => console.log('next card')}
        activity={activity}
        studentStates={studentStates}
      />
    </div>
  );
};
