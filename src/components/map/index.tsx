'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

//Required for next.js leaflet patch: https://stackoverflow.com/questions/77978480/nextjs-with-react-leaflet-ssr-webpack-window-not-defined-icon-not-found
//Keep these imports in this order!
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet-defaulticon-compatibility';

export default function Map() {
  return (
    <MapContainer
      center={[43.742869999215117, -79.455459999623258]}
      zoom={11}
      scrollWheelZoom={true}
      //Defined w/h is importaint
      style={{ height: '100vh', width: '100vw' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      <Marker position={[43.742869999215117, -79.455459999623258]}>
        <Popup>We will put info for each marker here</Popup>
      </Marker>

      <Fab color='primary' style={{ position: 'absolute', bottom: 24, right: 24 }}>
        <AddIcon />
      </Fab>
    </MapContainer>
  );
}
