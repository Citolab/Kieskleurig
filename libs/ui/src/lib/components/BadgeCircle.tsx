import React from 'react';
import { EcologyIcon, EconomyIcon, SamenlevingIcon } from './DomainIcons';

const SVGComponent = function (props) {
  return <svg {...props}>{props.children}</svg>;
};

const Circle = function (props) {
  return <circle {...props}>{props.children}</circle>;
};

interface Props {
  domain?: 'samenleving' | 'ecologie' | 'economie';
  totalAll?: number;
  totalYou?: number;
}
export default function BadgeCircle(props: Props) {
  let { totalAll, totalYou } = props;
  totalAll = totalAll || 0;
  totalYou = totalYou || 0;
  return (
    <SVGComponent height="140" width="140">
      <Circle cx="70" cy="70" r={totalAll * 60} fill="#E5E5EC" />
      <Circle
        cx="70"
        cy="70"
        r={totalYou * 60}
        fill="none"
        stroke="#020644"
        strokeWidth="2"
      />
      <g transform="translate(58 58)">
        {props.domain === 'samenleving' && <SamenlevingIcon />}
        {props.domain === 'ecologie' && <EcologyIcon />}
        {props.domain === 'economie' && <EconomyIcon />}
      </g>
    </SVGComponent>
  );
}
// <div>{total}</div>

{
  /* 
  <div
  style={{
    minWidth: +total * 168,
    minHeight: +total * 168,
    width: +total * 168,
    height: +total * 168,
    backgroundColor: color,
  }}
  className={`rounded-full relative flex items-center justify-center text-white text-opacity-50 p-1 m-0.5`}
>
  {domain === 'samenleving' && <SamenlevingIcon />}
  {domain === 'ecologie' && <EcologyIcon />}
  {domain === 'economie' && <EconomyIcon />}
</div>; 
*/
}
