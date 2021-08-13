import React, { useState } from 'react';

interface Props {
  code?: string;
  checking?: boolean;
  errorMessage?: string;
  doLogin: (code: string) => void;
}
export function Login(props: Props) {
  const [code, setCode] = useState('');

  const login = () => {
    if (code) {
      props.doLogin(code);
      setCode('');
    }
  };
  return (
      <div className="flex flex-col p-4">
        <div className="mb-6">
          <h1 className="font-header h1">KiesKleurig</h1>
          <label
            className="block text-grey-darker text-sm font-bold mb-2"
            htmlFor="password"
          >
            Code
          </label>
          <input
            className="shadow appearance-none border border-red rounded w-full py-2 px-3 text-grey-darker mb-3"
            id="password"
            type="text"
            value={code}
            disabled={props.checking}
            placeholder="*****"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                login();
              }
            }}
            onChange={(e) => {
              setCode(e.target.value);
            }}
          />
          <p className="text-muted-400 text-xs italic">
            Voer de code op het scherm in.
          </p>

          {!code && props.errorMessage ? (
            <p className="text-red-500">{props.errorMessage}</p>
          ) : (
            ''
          )}
        </div>
        <div className="flex items-center justify-between">
          <button
            disabled={props.checking || !code}
            onClick={(e) => {
              e.preventDefault();
              login();
            }}
            className="btn-primary"
          >
            {props.checking ? 'Bezig met controleren..' : 'Start'}
          </button>
        </div>
      </div>
  );
}
