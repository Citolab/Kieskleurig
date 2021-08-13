import React from 'react';
import Dialog from './Dialog';

export default { title: 'Components/Dialog', component: Dialog };

export const normal = () => (
  <Dialog open={false} onClose={() => console.log('close')}>
    <div>Dit is een dialog</div>
  </Dialog>
);
