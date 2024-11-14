'use client';

import { CircularProgress } from '@mui/material';
import dynamic from 'next/dynamic';
import React from 'react';

//Dynamic import required for next.js leaflet patch: https://stackoverflow.com/questions/77978480/nextjs-with-react-leaflet-ssr-webpack-window-not-defined-icon-not-found
const LazyMap = dynamic(() => import('@/src/components/map/query'), {
  ssr: false,
  loading: () => (
    <div className='w-full h-full bg-slate-100 text-black justify-center items-center flex flex-col space-y-8'>
      <CircularProgress />
      Loading Map
    </div>
  ),
});

export default function Home() {
  return (
    <main className='w-full h-screen'>
      <LazyMap />
    </main>
  );
}
