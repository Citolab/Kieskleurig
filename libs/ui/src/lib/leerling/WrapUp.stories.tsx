import { Card, StudentReport, themes } from '@burgerschap/data';
import React from 'react';
import { WrapUp } from './WrapUp';

export default { title: 'Leerling/WrapUp', component: WrapUp };

const report: StudentReport = {
  matching: 2,
  notMatching: 1,
  studentCount: 29,
  uniqueRankings: 25,
  domainCounts: {
    ecologie: 45,
    samenleving: 44,
    economie: 16,
  },
};

const cards: Card[] = themes.map((t, i) => {
  if (i < 2) {
    return { ...t.cards[0], domain: 'ecologie' };
  } else {
    return { ...t.cards[1], domain: 'samenleving' };
  }
});

export const normal = () => (
  <div className="w-full flex flex-wrap">
    <WrapUp cards={cards} report={report}></WrapUp>
  </div>
);
