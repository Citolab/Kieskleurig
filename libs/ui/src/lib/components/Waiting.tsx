import React from 'react';
import './Waiting.scss';
interface Props {
  text?: string;
}
export const Waiting = (props: Props) => {
  return (
    <>
      <div className="loader">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
      {props.text && <div className="flex text-center justify-around p-4 mt-5 justify-items-stretch">{props.text}</div>}
    </>
  );
}
