import React from 'react';
import { Start } from '@burgerschap/ui';
import { useHistory } from 'react-router-dom';
export function IntroPage() {
  const history = useHistory();

  return (
    <div>
      <Start
        doStart={async () => {
          history.push('choose');
        }}
      />
    </div>
  );
}
export default IntroPage;
