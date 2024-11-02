'use client';

import { MapContainer, TileLayer, Marker } from 'react-leaflet';

//Required for next.js leaflet patch: https://stackoverflow.com/questions/77978480/nextjs-with-react-leaflet-ssr-webpack-window-not-defined-icon-not-found
//Keep these imports in this order!
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet-defaulticon-compatibility';
import { MapMarkerData } from '@/app/api/types';
import { Popup } from '../marker/popup';
import { EditMarkerDialog } from '../marker/edit';
import { useState } from 'react';

interface MapProps {
  markers: MapMarkerData[] | undefined;
}

export function Map(props: MapProps) {
  const { markers } = props;

  const [showEditMarkerDialog, setShowEditMarkerDialog] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<MapMarkerData>();

  const handleEditMarker = (marker: MapMarkerData) => {
    setShowEditMarkerDialog(true);
    setSelectedMarker(marker);
  };

  return (
    <MapContainer
      center={[43.742869999215117, -79.455459999623258]}
      zoom={11}
      scrollWheelZoom={true}
      //TODO: Add bounds and max/min zoom

      //Defined w/h is importaint
      style={{ height: '100vh', width: '100vw' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />

      {markers &&
        //TODO: Slice the list to the amount of markers the user specifies. See comments in query component
        markers.map((markerData) => {
          const id = markerData.id;
          const coordinates = markerData.coordinates && (markerData.coordinates[0] as any); //Yucky

          if (coordinates)
            return (
              <Marker position={[coordinates[1], coordinates[0]]} key={id}>
                <Popup markerData={markerData} onEditMarker={handleEditMarker} />
              </Marker>
            );
        })}

      <EditMarkerDialog
        open={showEditMarkerDialog}
        marker={selectedMarker}
        onClose={() => setShowEditMarkerDialog(false)}
      />
    </MapContainer>
  );
}
