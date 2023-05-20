import React, { useState, useRef, useEffect } from 'react';

import './widget.css';
import { useWindowWidth } from '../hooks/useWindowWidth';
import { IFrameEvent } from './types';
import { Loader } from './Loader';

export const Widget = () => {
  const [width, setWidth] = useState<number>();
  const [iframeHeight, setIframeHeight] = useState<number>();
  const iframeContainer = useRef<HTMLDivElement>(null);
  const windowWidth = useWindowWidth();

  useEffect(() => {
    const handleIframeResize = (event: MessageEvent<IFrameEvent>) => {
      if (event.data.type !== 'resize') {
        return;
      }

      setIframeHeight(event.data.height);
    };

    window.addEventListener('message', handleIframeResize);

    return () => window.removeEventListener('message', handleIframeResize);
  }, []);

  useEffect(() => {
    const measurements = iframeContainer?.current?.getBoundingClientRect();

    if (measurements) {
      setWidth(measurements.width);
    }
  }, [windowWidth]);

  return (
    <div className="widget">
      <h1>App content</h1>
      <p>Check out our latest podcast</p>
      <div className="iframe-container" ref={iframeContainer}>
        {!iframeHeight && <Loader />}
        <iframe
          className="iframe"
          height={iframeHeight ?? 0}
          width={width}
          src="/iframe"
        />
      </div>
    </div>
  );
};
