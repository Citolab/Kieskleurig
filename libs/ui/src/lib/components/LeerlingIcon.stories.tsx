import React from 'react';
import { EconomyIcon } from './DomainIcons';
import { LeerlingIcon } from './LeerlingIcon';

export default { title: 'Components/LeerlingIcon', component: LeerlingIcon };

export const normal = () => (
      <LeerlingIcon
        widthInPercentage={12}
        color={`bg-gray-200`}
      ></LeerlingIcon>
);

export const icon = () => (
  <LeerlingIcon
    widthInPercentage={5}
    color={`bg-gray-200`}
  ><EconomyIcon /></LeerlingIcon>
);

export const width = () => (
  <LeerlingIcon
    widthInPercentage={50}
    color={`bg-gray-200`}
  ></LeerlingIcon>
);

export const colored = () => (
  <LeerlingIcon
    widthInPercentage={5}
    color={`bg-green-500`}
  ></LeerlingIcon>
);