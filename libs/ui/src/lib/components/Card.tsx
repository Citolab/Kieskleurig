import React from 'react';

interface Props {
  children: React.ReactNode;
  badge?: React.ReactNode;
  id: string;
  title?: string;
  maxWidth?: string;
  opposite?: boolean;
  sizeInPercentage?: number;
  sizeToShow?: number;
  state?: 'normal' | 'selected';
  color?: string;
  onSelect?: (id: string) => void;
  className?: string;
  flexGrow?: number;
}
export function Card(props: Props) {
  const {
    id,
    onSelect,
    badge,
    state,
    title,
    color,
    opposite,
    sizeInPercentage,
    maxWidth,
    sizeToShow,
  } = props;

  return (
    <div
      key={id}
      style={{
        boxShadow: state !== 'selected' ? `inset 0px 0px 0px 2px #F9F5F4` : `inset 0px 0px 0px 4px ${lightenDarkenColor(color, -100)}`,
        
        // transform: `scale(${state === 'selected' ? `1` : `0.9`})` ,
        // state !== 'selected' ?           : 'white',
        backgroundColor: opposite
          ? lightenDarkenColor(color, -40)
          : lightenDarkenColor(color, 40),
        color: opposite
          ? lightenDarkenColor(color, 80)
          : lightenDarkenColor(color, -80),
        flexGrow: !isNaN(sizeInPercentage) ? sizeInPercentage: 100,
        width: !isNaN(sizeInPercentage) ? sizeInPercentage + '%': '100%',
        maxWidth: maxWidth ||  (!isNaN(sizeInPercentage) ? sizeInPercentage + '%': '100%'),
        // maxHeight: !isNaN(percentage) ? '200px' : 'auto',
        minWidth: '70px'
      }}
      className={`flex p-3 rounded-3xl text-left overflow-hidden
        ${opposite ? 'rounded-bl-none' : 'rounded-br-none'}
        ${state === 'normal' && `text-gray-800`}
        `}
        // ${state === 'selected' && `border-2 border-primary`}
      onClick={() => onSelect && onSelect(id)}
    >
      <div>
        {title && (
          <div
            style={{
              color: opposite
                ? lightenDarkenColor(color, 30)
                : lightenDarkenColor(color, -30),
            }}
            className="text-sm font-bold"
          >
            {title}
          </div>
        )}
        <div className="flex">
          <div className="flex flex-col mr-5">
          {!isNaN(sizeInPercentage) &&
          <div className="text-2xl font-bold " style={{
            color: opposite
              ? lightenDarkenColor(color, 30)
              : lightenDarkenColor(color, -30),
          }}>
            {sizeToShow ? sizeToShow : sizeInPercentage}%
          </div>
          }
          <div>{badge}</div>
          </div>
          <div className="mt-1">{props.children}</div>
        </div>
      </div>
      
    </div>
  );
}

function lightenDarkenColor(colorCode, amount) {
  let usePound = false;

  if (colorCode[0] === '#') {
    colorCode = colorCode.slice(1);
    usePound = true;
  }
  const num = parseInt(colorCode, 16);
  let r = (num >> 16) + amount;

  if (r > 255) {
    r = 255;
  } else if (r < 0) {
    r = 0;
  }

  let b = ((num >> 8) & 0x00ff) + amount;

  if (b > 255) {
    b = 255;
  } else if (b < 0) {
    b = 0;
  }

  let g = (num & 0x0000ff) + amount;

  if (g > 255) {
    g = 255;
  } else if (g < 0) {
    g = 0;
  }
  let color = (g | (b << 8) | (r << 16)).toString(16);
  while (color.length < 6) {
    color = 0 + color;
  }
  return (usePound ? '#' : '') + color;
}
