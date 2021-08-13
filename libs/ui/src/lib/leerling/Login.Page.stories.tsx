import React from 'react';
import { linkTo } from '@storybook/addon-links';
import { Login } from './Login.Page';

export default { title: 'Leerling/Login', component: Login };

export const normal = () => <Login doLogin={linkTo('Leerling/Start')} />;

export const error = () => <Login errorMessage="Uh oh, wrong code" doLogin={linkTo('Leerling/Start')} />;

export const checking = () => <Login checking={true} doLogin={linkTo('Leerling/Start')} />;

export const code = () => <Login code={'WACHTWOORD'} doLogin={linkTo('Leerling/Start')} />;
