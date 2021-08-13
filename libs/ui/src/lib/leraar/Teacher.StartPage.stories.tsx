import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import { TeacherStartPage } from './Teacher.StartPage';
import { Activity, ActivityState, OrderState, CardsStateModel, themes } from '@burgerschap/data';

export default {
  title: 'Leraar/TeacherStartPage',
  component: TeacherStartPage,
  decorators: [withKnobs],
};

export const Normal = () => {
  const activity: Activity = {
    code: 'ABCDE',
    currentThemeId: themes[0].id,
    state: ActivityState.notstarted,
  } as Activity;

  const notStarted = {
    report: null,
    activity: activity,
    orderState: OrderState.group,
    activityCode: activity.code,
    cards: [],
    currentThemeId: themes[0].id,
    user: null,
    confirmedAnswer: false
  } as CardsStateModel;
  const choose1 = {
    report: null,
    activity: activity,
    orderState: OrderState.group,
    activityCode: activity.code,
    cards: [0].map(i => themes[i].cards[0]),
    currentThemeId: themes[0].id,
    user: null,
    confirmedAnswer: false
  } as CardsStateModel;
  const choose4 = {
    report: null,
    activity: activity,
    orderState: OrderState.group,
    activityCode: activity.code,
    cards: [0, 1, 2, 3].map(i => themes[i].cards[0]),
    currentThemeId: themes[0].id,
    user: null,
    confirmedAnswer: false
  } as CardsStateModel;
  const sort1 = {
    report: null,
    activity: activity,
    orderState: OrderState.group,
    activityCode: activity.code,
    cards: themes.map((theme,i) => i < 1 ? {...theme.cards[0], order: i} : theme.cards[0]),
    currentThemeId: themes[0].id,
    user: null,
    confirmedAnswer: false
  } as CardsStateModel;
  const sort4 = {
    report: null,
    activity: activity,
    orderState: OrderState.group,
    activityCode: activity.code,
    cards:  themes.map((theme,i) => i < 4 ? {...theme.cards[0], order: i} : theme.cards[0]),
    currentThemeId: themes[0].id,
    user: null,
    confirmedAnswer: false
  } as CardsStateModel;
  const done = {
    report: null,
    activity: activity,
    orderState: OrderState.done,
    activityCode: activity.code,
    cards:  themes.map((theme,i) => ({...theme.cards[0], order: i})),
    currentThemeId: themes[0].id,
    user: null,
    confirmedAnswer: false
  } as CardsStateModel;
  const studentStates = [notStarted, choose1, choose4, sort1, sort4, done].map((state, index) => ({...state, avatarIndex: index}));
  return (
    <div>
      {/* <pre className="text-xs text-gray-500">{ JSON.stringify(state, null, 4) }</pre> */}
      <TeacherStartPage
        onStartGroup={() => console.log('start group')}
        activity={activity}
        studentStates={studentStates}
      />
    </div>
  );
};
