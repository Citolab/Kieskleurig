import React from 'react';

import ExitIcon from './ExitIcon';
import IconButton from './IconButton';
interface Props {
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
}
export default function Dialog(props: Props) {
  const { open, onClose } = props;
  if (!open) {
    return <></>;
  }
  return (
    <div className="fixed inset-1 z-50 overflow-auto bg-gray-800 bg-opacity-25 flex">
      <div className="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded-lg">
      <div>{props.children}</div>
      <span className="absolute top-0 right-0 p-4">     
       <IconButton className=" bg-primary text-white" onClick={() => onClose()}>
         <ExitIcon />
       </IconButton>
     </span>
     </div>
   </div>
 );
}