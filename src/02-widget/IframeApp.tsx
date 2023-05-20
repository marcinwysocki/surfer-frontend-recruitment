import React, { useEffect } from 'react';
import { useWindowWidth } from '../hooks/useWindowWidth';
import { IFrameEvent } from './types';

import './iframe-app.css';

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
    <div className="iframe-app-container">
      Dynamic marketing content will be here
    </div>
  );
};
