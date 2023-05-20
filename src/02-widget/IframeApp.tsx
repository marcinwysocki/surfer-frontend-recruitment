import React, { useEffect } from 'react';
import { useWindowWidth } from '../hooks/useWindowWidth';
import { IFrameEvent } from './types';

export const IframeApp = () => {
  const windowWidth = useWindowWidth();

  useEffect(() => {
    const iframeHeight = document.documentElement.offsetHeight;

    const message: IFrameEvent = {
      type: 'resize',
      height: iframeHeight,
    };

    parent.postMessage(message);
  }, [windowWidth]);

  return (
    <div
      style={{
        backgroundColor: 'rebeccapurple',
        color: 'white',
        padding: '2rem',
        borderRadius: '1rem',
        fontSize: '2rem',
      }}
    >
      Dynamic marketing content will be here
    </div>
  );
};
