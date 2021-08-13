import React from 'react';
import { End } from './End.page';
import { linkTo } from '@storybook/addon-links';

export default { title: 'Leerling/End',
component: End };

export const normal = () => (
  <End doWrapUp={linkTo('Leerling/Wrapup')} />
)
