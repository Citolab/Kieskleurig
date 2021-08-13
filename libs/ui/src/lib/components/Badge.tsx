import React from 'react';
import { EcologyIcon, EconomyIcon, SamenlevingIcon } from './DomainIcons';

interface Props {
    color: string;
    tint?: 'light' | 'dark';
    domain?: 'samenleving' | 'ecologie' | 'economie';
    total?: number|string;
  }
  export default function Badge(props: Props) {
    const { color, domain, total } = props;
    return (
      <div
        style={{minWidth: 24, minHeight:24, backgroundColor: color}}
        className={`rounded-full relative flex items-center justify-center text-white text-opacity-80 p-1 m-0.5`}
      >
        { domain === 'samenleving' && <SamenlevingIcon />}
        { domain === 'ecologie' && <EcologyIcon />}
        { domain === 'economie' && <EconomyIcon />}
        { total && (
          <div>{total}</div>
        )}
      </div>
    );
  }