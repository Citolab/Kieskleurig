import React from 'react';
import { Distribution } from './Distribution';

export default { title: 'Components/Distribution', component: Distribution };

export const normal = () => (
  <Distribution
    className="bg-green-700"
    totalEcologiePercentage={20}
    totalEconomiePercentage={30}
    totalSamenlevingPercentage={50}
  ></Distribution>
);
