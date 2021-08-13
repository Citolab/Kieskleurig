import React from 'react';
import BadgeCircle from './BadgeCircle';

export default { title: 'Components/BadgeCircle', component: BadgeCircle };

export const allColors = () => (
  <div>
    <BadgeCircle domain="samenleving" totalAll={0.1} totalYou={0.6}></BadgeCircle>
    <BadgeCircle domain="ecologie" totalAll={0.3} totalYou={0.2}></BadgeCircle>
    <BadgeCircle domain="economie" totalAll={0.6} totalYou={0.2}></BadgeCircle>
  </div>
);
