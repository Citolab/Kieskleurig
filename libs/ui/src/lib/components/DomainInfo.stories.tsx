import React from 'react';
import { EcologieInfo, EconomieInfo, SamenlevingInfo } from './DomainInfo';


export default { title: 'Components/DomainInfo' };

export const economyInfo = () => <EconomieInfo />;
export const ecologyInfo = () => <EcologieInfo />;
export const samenlevingInfo = () => <SamenlevingInfo />;
