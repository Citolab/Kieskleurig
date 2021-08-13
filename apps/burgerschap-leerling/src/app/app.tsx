import React, { useEffect, useState, useRef } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { ChooseOneCardPage } from './pages/choose-one';
import WrapupPage from './pages/wrapup';
import loginStore, {
  AutoLoginFailAction,
  LoginSuccessAction,
} from './pages/login.store';
import ChoosePage from './pages/choose';
import LoginPage from './pages/login';
import store, { RestoreStateAction } from './pages/cards.store';
import { getUserInfo } from '@burgerschap/data';
import { initStore, setStoreContext } from 'rx-firebase-store';
import IntroPage from './pages/intro';
import { environment } from '../environments/environment';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/firebase-functions';
import 'firebase/auth';

export function App() {
  const mounted = useRef(true);
  const [loginState, setLoginState] = useState(loginStore.currentState());
  const [state, setState] = useState(store.currentState());
  useEffect(() => {
    // mounted variable because of: https://stackoverflow.com/a/60907638/6729295
    let loginSubs: { unsubscribe: () => void };
    let subs: { unsubscribe: () => void };
    if (mounted.current) {
      loginSubs = loginStore.subscribe(setLoginState);
      subs = store.subscribe(setState);
    }
    return () => {
      mounted.current = false;
      if (subs) subs.unsubscribe();
      if (loginSubs) loginSubs.unsubscribe();
    };
  }, []);

  // useEffect(() => {
  //   setStoreContext([{ name: 'history', dependency: history }]);
  // }, [history]);

  function PrivateRoute({ children, ...rest }) {
    if (!loginState.user || !state.activity) {
      return <div>Loading...</div>;
    } else {
      return (
        <Route
          {...rest}
          render={({ location }) =>
            loginState.user ? (
              children
            ) : (
              <Redirect
                to={{
                  pathname: '/',
                  state: { from: location },
                }}
              />
            )
          }
        />
      );
    }
  }

  useEffect(() => {
    const authWatcher = (auth: firebase.auth.Auth) => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          getUserInfo(user).then((userInfo) => {
            if (userInfo) {
              loginStore
                .dispatch(new LoginSuccessAction({ userInfo }))
                .then(() => {
                  store.dispatch(new RestoreStateAction({ init: true }));
                });
            } else {
              loginStore.dispatch(new AutoLoginFailAction());
            }
          });
        } else {
          loginStore.dispatch(new AutoLoginFailAction());
        }
      });
    };

    const initFirebaseStore = async () => {
      const app = await firebase.initializeApp(environment.firebase);
      initStore(app, 'europe-west1', {
        collectionName: () => {
          const collectionName = `student_actions${
            !environment.production ? '_dev' : ''
          }/${app.auth()?.currentUser?.uid}/actions`;
          return collectionName;
        },
        addUserId: true,
        autoStore: true,
      });
      // start watching auth changes.
      authWatcher(app.auth());
    };
    initFirebaseStore();
  }, []);

  return loginState.loading ? (
    <div>Loading</div>
  ) : (
    <div className="w-full md:w-1/2 lg:w-1/3 mx-auto relative h-screen">
      <Switch>
        <PrivateRoute path="/intro">
          <IntroPage />
        </PrivateRoute>
        <PrivateRoute path="/choose-one">
          <ChooseOneCardPage />
        </PrivateRoute>
        <PrivateRoute path="/choose">
          <ChoosePage />
        </PrivateRoute>
        <PrivateRoute path="/wrapup">
          <WrapupPage />
        </PrivateRoute>
        <Route path="/">
          <LoginPage />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
