import React from 'react';

interface Props {
    children: React.ReactNode;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    className?: string;
  }
  export default function IconButton(props: Props) {
    const {
      children,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onClick = (event: React.MouseEvent<HTMLButtonElement>) => {},
      className = '',
    } = props;
    return (
      <button
        onClick={onClick}
        className={`focus:outline-none focus:border-none hover:bg-gray-400 hover:bg-opacity-25 p-1 rounded-full inline-flex items-center ${className}`}
      >
        {children}
      </button>
    );
  }