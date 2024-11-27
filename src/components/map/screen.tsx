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
import { useRef, useState, useEffect } from 'react';
import { EditFilterDialog, FilterSettings } from '../filter/edit';
import { CircularProgress, Dialog, DialogContent, Fab } from '@mui/material';
import { Add, FilterAlt } from '@mui/icons-material';
import { LeafletMouseEvent, Map as RLMap } from 'leaflet';

interface MapProps {
  markers: MapMarkerData[] | undefined;
  onUpsertMarker: (newMarker: MapMarkerData) => Promise<void>;
  onDeleteMarker: (id: number) => Promise<void>;
}

export function Map(props: MapProps) {
  const { markers, onUpsertMarker, onDeleteMarker } = props;

  const [showEditMarkerDialog, setShowEditMarkerDialog] = useState(false);
  const [showEditFilterDialog, setShowEditFilterDialog] = useState(false);

  const [selectedMarker, setSelectedMarker] = useState<MapMarkerData>({
    coordinates: [['', '']] as any,
  } as MapMarkerData);

  const [filterSettings, setFilterSettings] = useState<FilterSettings>(() => {
    const savedSettings = localStorage.getItem('filterSettings');
    return savedSettings ? JSON.parse(savedSettings) : {
      markerLimit: [0, 300],
      data: {
      },
    };
  });

  useEffect(() => {
    localStorage.setItem('filterSettings', JSON.stringify(filterSettings));
  }, [filterSettings]);

  const mapRef = useRef<RLMap>(); // Ref used for doubleclick listener

  const handleEditMarker = (marker: MapMarkerData) => {
    setShowEditMarkerDialog(true);
    setSelectedMarker(marker);
  };

  const handleAddMarker = (
    mouseEvent?: LeafletMouseEvent, // A mouseEvent will only be passed in if the user 'double clicks' to add a marker. This means the lat and long coordinates will be retrieved from where the mouse is
  ) => {
    // User 'double clicks' to add marker
    if (mouseEvent) {
      const lat = mouseEvent.latlng.lat;
      const long = mouseEvent.latlng.lng;
      setSelectedMarker({ coordinates: [[long, lat]] as any } as MapMarkerData);
    } else {
      // User clicks 'plus' button to add marker
      setSelectedMarker({ coordinates: [['', '']] as any } as MapMarkerData);
    }

    setShowEditMarkerDialog(true);
  };

  mapRef.current?.on('dblclick', handleAddMarker); // Add an doubleclick listener to the map

  return (
    <MapContainer
      ref={mapRef as any}
      center={[43.742869999215117, -79.455459999623258]}
      zoom={11}
      scrollWheelZoom={true}
      doubleClickZoom={false}
      //TODO: Add bounds and max/min zoom

      //Defined w/h is importaint
      style={{ height: '100vh', width: '100vw' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />

      {markers ? (
        // filter markers
        markers.slice(filterSettings.markerLimit[0], filterSettings.markerLimit[1]).filter((markerData) => {
          
          return (Object.keys(filterSettings.data) as (keyof MapMarkerData)[]).every((key) => {
            return (filterSettings.data[key] == undefined ||
              filterSettings.data[key] == null ||
              filterSettings.data[key] == '') ? true :
                   markerData[key] === filterSettings.data[key];
          });
        })
          .map((markerData) => {
          const id = markerData.id;
          const coordinates = markerData.coordinates && (markerData.coordinates[0] as any); // Yucky (see comment in
            // /app/api/types.ts)

          if (coordinates)
            return (
              <Marker position={[coordinates[1], coordinates[0]]} key={id}>
                <Popup markerData={markerData} onEditMarker={handleEditMarker} />
              </Marker>
            );
        })
      ) : (
        // Marker loading state
        <Dialog open={true}>
          <DialogContent className='flex flex-col justify-center items-center space-y-8'>
            <CircularProgress />
            Loading Markers
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog components */}
      <EditMarkerDialog
        open={showEditMarkerDialog}
        marker={selectedMarker}
        onClose={() => setShowEditMarkerDialog(false)}
        onSubmit={onUpsertMarker}
        onDeleteMarker={onDeleteMarker}
      />

      <EditFilterDialog
        open={showEditFilterDialog}
        currentFilterSettings={filterSettings}
        totalMarkers={markers?.length ?? 0}
        onClose={() => setShowEditFilterDialog(false)}
        onSubmit={(newFilterSettings) => {
          setFilterSettings(newFilterSettings);
          setShowEditFilterDialog(false);
        }}
      />

      {/* HUD Components */}
      <Fab
        style={{ position: 'absolute', top: 12, right: 12 }}
        variant='extended'
        size='medium'
        color='primary'
        onClick={() => setShowEditFilterDialog(true)}
      >
        <FilterAlt sx={{ mr: 1 }} />
        Filter
      </Fab>

      <Fab style={{ position: 'absolute', bottom: 24, right: 16 }} color='primary' onClick={() => handleAddMarker()}>
        <Add />
      </Fab>
    </MapContainer>
  );
}
