import React, { useState } from 'react';
import Dialog from '../components/Dialog';
import IconButton from '../components/IconButton';
import { EcologyIcon, EconomyIcon, SamenlevingIcon } from './DomainIcons';

export const DomainInfo = () => {
  const [confirmOpen1, setConfirmOpen1] = useState(false);
  const [confirmOpen2, setConfirmOpen2] = useState(false);
  return (
    <div>
      <EcologieInfo showGoodFor={false}></EcologieInfo>
      <EconomieInfo showGoodFor={false}></EconomieInfo>
      <SamenlevingInfo showGoodFor={false}></SamenlevingInfo>
    </div>
  );
};

interface Props {
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  dialog: React.ReactNode;
  children: React.ReactNode;
  button: React.ReactNode;
  showGoodFor: boolean;
}
function Info(props: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  return (
    <>
      <div className="flex h-12 items-center justify-between">

        <IconButton onClick={(event) => props.onClick(event)}>
          {props.button}
          <div className="ml-2">{props.showGoodFor && `Goed voor `}<span className="font-bold">{props.children}</span></div>
        </IconButton>

        <div
          onClick={() => setConfirmOpen(true)}>
        <InfoIcon ></InfoIcon>
        </div>
      </div>
      <Dialog onClose={() => setConfirmOpen(false)} open={confirmOpen}>
        {props.dialog}
      </Dialog>
    </>
  );
}

interface InfoProps {
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  showGoodFor: boolean;

}
export function EcologieInfo(props: InfoProps) {
  return (
    <Info
      showGoodFor={props.showGoodFor}
      onClick={(event) => props.onClick(event)}
      button={<EcologyIcon />}
      dialog={
        <div className="text-gray-800">
          de samenhang van levende wezens met elkaar en hun omgeving.
          Bijvoorbeeld:
          {['klimaat', 'biodiversiteit', 'landbouw', 'natuur'].map(
            (tag, ind) => (
              <span
                key={ind}
                className="inline-flex bg-gray-200 text-gray-700 rounded-full h-6 px-3 mr-1 mt-1 justify-center items-center"
              >
                {tag}
              </span>
            )
          )}
        </div>
      }
    >
      Ecologie
    </Info>
  );
}

export function EconomieInfo(props: InfoProps) {
  return (
    <Info
    showGoodFor={props.showGoodFor}

      onClick={(event) => props.onClick(event)}
      button={<EconomyIcon />}
      dialog={
        <div className="text-gray-800">
          het gedrag van mensen, bedrijven en overheden bij het consumeren en
          produceren en de verdeling van schaarse middelen in een samenleving.
          <div>
            {['werk', 'bijstand', 'ondernemerschap', 'vraag en aanbod'].map(
              (tag, ind) => (
                <span
                  key={ind}
                  className="inline-flex bg-gray-200 text-gray-700 rounded-full h-6 px-3 mr-1 justify-center items-center"
                >
                  {tag}
                </span>
              )
            )}
          </div>
        </div>
      }
    >
      Economie
    </Info>
  );
}

export function SamenlevingInfo(props: InfoProps) {
  return (
    <Info
    showGoodFor={props.showGoodFor}

      onClick={(event) => props.onClick(event)}
      button={<SamenlevingIcon />}
      dialog={
        <div className="text-gray-800">
          Een groep mensen die samen een systeem vormen waarin de relaties
          tussen mensen centraal staan. Een samenleving is gebaseerd op normen,
          waarden, regels en wetten.
          <div>
            {['gelijkheid', 'vrijheid', 'participatie', 'cultuur'].map(
              (tag, ind) => (
                <span
                  key={ind}
                  className="inline-flex bg-gray-200 text-gray-700 rounded-full h-6 px-3 mr-1 justify-center items-center"
                >
                  {tag}
                </span>
              )
            )}
          </div>
        </div>
      }
    >
      Samenleving
    </Info>
  );
}

function InfoIcon() {
  return (
    <svg
      className="w-6 h-6"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
}
