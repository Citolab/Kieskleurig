import { motion } from 'framer-motion';
import React from 'react';
import { EcologyIcon, EconomyIcon, SamenlevingIcon } from './DomainIcons';

interface Props {
  className: string;
  totalEcologiePercentage: number;
  totalEconomiePercentage: number;
  totalSamenlevingPercentage: number;
}
export const Distribution = (props: Props) => (
  <ul className={props.className}>
    <motion.li
      className="bg-green-100 text-green-500 w-full flex justify-center items-center"
      animate={{ width: props.totalEcologiePercentage * 100 + '%' }}
      initial={{ width: 0 }}
    >

      <EcologyIcon></EcologyIcon>
      {/* <p>{Math.round(props.totalEcologiePercentage * 100)}%</p>&nbsp;
        <p className="text-sm">Ecologie</p> */}
    </motion.li>
    <motion.li
      className="bg-red-100 text-red-500 w-full flex justify-center items-center"
      animate={{ width: props.totalEconomiePercentage * 100 + '%' }}
      initial={{ width: 0 }}
    >
      <EconomyIcon></EconomyIcon>
      {/* <p>{Math.round(props.totalEconomiePercentage * 100)}%</p>&nbsp;
        <p className="text-sm">Economie</p> */}
    </motion.li>
    <motion.li
      className="bg-blue-100 text-blue-500 w-full flex justify-center items-center"
      animate={{ width: props.totalSamenlevingPercentage * 100 + '%' }}
      initial={{ width: 0 }}
    >
      <SamenlevingIcon></SamenlevingIcon>
      {/* <p>{Math.round(props.totalSamenlevingPercentage * 100)}%</p>&nbsp;
        <p className="text-sm">Samenleving</p> */}
    </motion.li>
  </ul>
);
