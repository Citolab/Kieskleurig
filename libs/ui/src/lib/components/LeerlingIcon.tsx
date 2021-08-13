import React from 'react';

interface Props {
  color: string;
  children?: React.ReactNode;
  widthInPercentage: number;
}
export const LeerlingIcon = (props: Props) => {
  const { color, children, widthInPercentage } = props;
  const circle = {
    position: 'relative' as const,
    width: widthInPercentage + '%',
    paddingBottom: widthInPercentage + '%',
    borderRadius: '50%',
  };

  const circleh3 = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    margin: '0',
  };

  return (
    <div
      style={circle}
      className={`text-white text-opacity-80 ${color} flex items-center justify-center`}
    >
      <div style={circleh3}>{children}</div>
    </div>
  );
};
