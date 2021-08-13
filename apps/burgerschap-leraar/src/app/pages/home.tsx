import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

export function HomePage() {
  const history = useHistory();
  return (
    <>
      <div className="z-10 relative">
        <h1 className="font-header p-4">KiesKleurig</h1>
        <p className="font-bold px-4">
          In dit spel draait alles om jouw mening en die van je klasgenoten.
        </p>
        <p className="px-4">
          Denk jij anders over maatschappelijke onderwerpen dan je klas?
        </p>
      </div>
      <img
        src="/assets/Burgerschat-hero.png"
        alt="logo"
        className="mx-auto max-h-96 px-12 absolute inset-x-0 bottom-0"
      />
      <button
        className="btn-primary fixed top-3 right-3 z-10"
        onClick={() => history.push('/start')}
      >
        Beginnen
      </button>
    </>
  );
}
