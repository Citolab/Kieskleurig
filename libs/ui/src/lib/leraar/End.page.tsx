import React from 'react';

interface Props {
  doWrapUp: () => void;
}
export const End = (props:Props) => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="w-2/3 h-2/3 pt-24">
      <p className="font-bold">Je hebt all stellingen op volgorde gezet. Dankjewel!</p>
      <p className="text-gray-600 pt-4">Klaar voor het klassengesprek?</p>
      <button
        className="fixed right-2 bottom-3 btn-primary"
        onClick={props.doWrapUp}
      >
        Naar de wrapup
      </button>
    </div>
  </div>
);
