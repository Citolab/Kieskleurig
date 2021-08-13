import React from 'react';
import { Start } from './Start.Page';
import { linkTo } from '@storybook/addon-links';

export default { title: 'Leerling/Start',
component: Start  };

export const normal = () => (
  <Start doStart={linkTo('Leerling/ChooseCards')} />
);
