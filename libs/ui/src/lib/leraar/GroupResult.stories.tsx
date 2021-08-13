import {
  Activity,
  ActivityState,
  Card,
  CardsStateModel,
  OrderState,
  random,
  themes,
} from '@burgerschap/data';
import React from 'react';
import { GroupResult } from './GroupResult';

export default { title: 'Leraar/Result', component: GroupResult };
const activity: Activity = {
  code: 'ABCDE',
  currentThemeId: themes[0].id,
  state: ActivityState.finished,
} as Activity;

const get40_60ByIndex = (
  count: number,
  studentIndex: number,
  themeIndex
): Card => ({
  ...themes[themeIndex].cards[studentIndex <= count * 0.4 ? 0 : 1],
  domain:
    studentIndex < count * 0.2
      ? 'ecologie'
      : studentIndex < count * 0.6
      ? 'economie'
      : 'samenleving',
});

const get20_80ByIndex = (
  count: number,
  studentIndex: number,
  themeIndex
): Card => ({
  ...themes[themeIndex].cards[studentIndex <= count * 0.2 ? 0 : 1],
  domain:
    studentIndex < count * 0.3
      ? 'economie'
      : studentIndex < count * 0.4
      ? 'samenleving'
      : 'ecologie',
});

const get33_66ByIndex = (
  count: number,
  studentIndex: number,
  themeIndex
): Card => ({
  ...themes[themeIndex].cards[studentIndex <= count * 0.33 ? 0 : 1],
  domain:
    studentIndex < count * 0.1
      ? 'economie'
      : studentIndex < count * 0.5
      ? 'ecologie'
      : 'samenleving',
});

const get0_100ByIndex = (
  count: number,
  studentIndex: number,
  themeIndex
): Card => ({ ...themes[themeIndex].cards[0], domain: 'economie' });
const get100_0ByIndex = (
  count: number,
  studentIndex: number,
  themeIndex
): Card => ({ ...themes[themeIndex].cards[1], domain: 'samenleving' });

export const get_40_60 = () => {
  const studentStates = Array(10)
    .fill('')
    .map((_, studentIndex) => {
      const mostImportant = random(0, 3);
      return {
        orderState: OrderState.done,
        activity: activity,
        currentThemeId: themes[3].id,
        cards: themes
          .map((theme, index) => {
            return get40_60ByIndex(10, studentIndex, index);
          })
          .map((c, i) => {
            return { ...c, order: i === mostImportant ? 1 : 0 } as Card;
          }),
        user: null,
      } as CardsStateModel;
    });
  return (
    <div>
      {/* <pre className="text-xs text-gray-500">{ JSON.stringify(state, null, 4) }</pre> */}
      <GroupResult activity={activity} studentStates={studentStates} />
    </div>
  );
};

export const normal = () => {
  const studentStates = Array(29)
    .fill('')
    .map((_, studentIndex) => {
      const mostImportant = random(0, 3);
      return {
        orderState: OrderState.done,
        activity: activity,
        currentThemeId: themes[3].id,
        cards: themes
          .map((theme, index) => {
            return get40_60ByIndex(10, studentIndex, index);
          })
          .map((c, i) => {
            return { ...c, order: i === mostImportant ? 1 : 0 } as Card;
          }),
        user: null,
      } as CardsStateModel;   
     });
  return (
    <div>
      {/* <pre className="text-xs text-gray-500">{ JSON.stringify(state, null, 4) }</pre> */}
      <GroupResult activity={activity} studentStates={studentStates} />
    </div>
  );
};
