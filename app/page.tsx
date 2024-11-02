'use client';

import dynamic from 'next/dynamic';
import React from 'react';

//Dynamic import required for next.js leaflet patch: https://stackoverflow.com/questions/77978480/nextjs-with-react-leaflet-ssr-webpack-window-not-defined-icon-not-found
const LazyMap = dynamic(() => import('@/src/components/map/query'), {
  ssr: false,
  //TODO: Loading state
  loading: () => <p>Loading...</p>,
});

export default function Home() {
  return (
    <main className='w-full h-screen'>
      <LazyMap />
    </main>
  );
}
