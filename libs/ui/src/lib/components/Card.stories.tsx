import { themes } from '@burgerschap/data';
import React from 'react';
import Badge from './Badge';
import { Card } from './Card';

export default { title: 'Components/Card', component: Card };

export const select = () => (
  <>
    {themes.map((theme) => (

        <Card
          id="id"
          // title={theme.title}
          color={theme.themeColor}
          opposite={false}
        >
          {theme.cards[1].thesis}
        </Card>

    ))}
  </>
);
export const selected = () => (
  <>
    {themes.map((theme) => (

        <Card
          id="id"
          // title={theme.title}
          color={theme.themeColor}
          opposite={false}
          badge={
            <Badge color={theme.themeColor} domain="samenleving"></Badge>}
        >
          {theme.cards[1].thesis}
        </Card>

    ))}
  </>
);
export const progress = () => (
  <>
    {themes.map((theme) => (

        <Card
          id="id"
          // title={theme.title}
          color={theme.themeColor}
          opposite={false}
          badge={
            <>
            <Badge total="12" color={theme.themeColor} domain="ecologie"></Badge>
            <Badge total="3" color={theme.themeColor} domain="economie"></Badge>
            <Badge total="5" color={theme.themeColor} domain="samenleving"></Badge>
            </>}
        >
          {theme.cards[1].thesis}
        </Card>

    ))}
  </>
);
export const result = () => (
  <>
    {themes.map((theme) => (

        <Card
          id="id"
          title={theme.title}
          color={theme.themeColor}
          opposite={false}
          badge={
            <>
            <Badge total={Math.floor(Math.random()*2)} color={theme.themeColor} domain="ecologie"></Badge>
            <Badge total={Math.floor(Math.random()*10)} color={theme.themeColor} domain="economie"></Badge>
            <Badge total={Math.floor(Math.random()*3)} color={theme.themeColor} domain="samenleving"></Badge>
            </>}
        >
          {theme.cards[1].thesisShort}
        </Card>

    ))}
  </>
);
