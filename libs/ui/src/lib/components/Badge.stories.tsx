import React from 'react';
import Badge from './Badge';

export default { title: 'Components/Badge', component: Badge };

export const allColors = () => (
  <div>
    <Badge color="red" tint="light" domain="samenleving"></Badge>
    <Badge color="red"></Badge>
    <Badge color="red" tint="dark" domain="ecologie"></Badge>
    <Badge color="blue" tint="light" domain="economie"></Badge>
    <Badge color="blue"></Badge>
    <Badge color="blue" tint="dark" domain="ecologie"></Badge>
    <Badge color="green" tint="light" domain="samenleving"></Badge>
    <Badge color="green"></Badge>
    <Badge color="green" tint="dark" domain="ecologie"></Badge>
    <Badge color="pink" tint="light" domain="economie"></Badge>
    <Badge color="pink"></Badge>
    <Badge color="pink" tint="dark" domain="ecologie"></Badge>
  </div>
);
