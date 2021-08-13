import React from 'react';
import { Link } from 'react-router-dom';
import {
  EcologieInfo,
  EconomieInfo,
  SamenlevingInfo,
} from '../components/DomainInfo';

interface Props {
  doStart: () => void;
}
export const Start = (props: Props) => {
  return (
    <div className="flex flex-col">
      <div className="flex-grow p-4 bg-white w-full">
        <h1 className="font-header text-primary">KiesKleurig</h1>
        <p className="font-bold mb-4">
          In dit spel draait alles om jouw mening en die van je klasgenoten.
        </p>
        <p>Denk jij anders over maatschappelijke onderwerpen dan je klas?</p>
      </div>
      <div className="p-4">
        <p>
          Je krijgt straks standpunten te zien over verschillende onderwerpen.
          Alle standpunten hebben te maken met 3 domeinen:
        </p>
        <p className="mt-2">Klik op de "i" voor meer informatie</p>
        <EcologieInfo showGoodFor={false}></EcologieInfo>
        <EconomieInfo showGoodFor={false}></EconomieInfo>
        <SamenlevingInfo showGoodFor={false}></SamenlevingInfo>
      </div>
      <button className="btn-primary bottom-2 z-10" onClick={props.doStart}>
        Beginnen
      </button>
    </div>
  );
};
