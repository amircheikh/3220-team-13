import { MapMarkerData } from '@/app/api/types';
import { useEffect, useState } from 'react';
import { Map } from './screen';
import { getApiEndpoint } from '@/app/api/utils';
import { Alert, Snackbar } from '@mui/material';

export default function MapWithQuery() {
  const [markers, setMarkers] = useState<MapMarkerData[]>();

  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  const [showErrorSnackbar, setShowErrorSnackbar] = useState(false);

  const baseUrl = getApiEndpoint();

  // Used to get all marker data
  const queryMarkers = async () => {
    fetch(`${baseUrl}/api/get-markers`)
      .then((response) => response.json())
      .then((data) => {
        setMarkers(data);
      })
      .catch((err) => {
        console.error('Querying markers failed:', err);
        setShowErrorSnackbar(true);
      });
  };

  // Used when editing or creating a marker
  const upsertMarker = async (newMarker: MapMarkerData) => {
    fetch(`${baseUrl}/api/upsert-marker`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newMarker),
    })
      .then((response) => response.json())
      .then(async (data) => {
        console.log(data);
        await queryMarkers(); // We need to refetch the markers after updating one
        setShowSuccessSnackbar(true);
      })
      .catch((err) => {
        console.error('Upserting marker failed:', err);
        setShowErrorSnackbar(true);
      });
  };

  useEffect(() => {
    queryMarkers();
  }, []);

  return (
    <div>
      <Map markers={markers} onUpsertMarker={upsertMarker} />

      {/* Success and Error Snackbars */}
      <Snackbar open={showSuccessSnackbar} autoHideDuration={6000} onClose={() => setShowSuccessSnackbar(false)}>
        <Alert onClose={() => setShowSuccessSnackbar(false)} severity='success' variant='filled' sx={{ width: '100%' }}>
          Updated marker successfully
        </Alert>
      </Snackbar>

      <Snackbar open={showErrorSnackbar} autoHideDuration={6000} onClose={() => setShowErrorSnackbar(false)}>
        <Alert onClose={() => setShowErrorSnackbar(false)} severity='error' variant='filled' sx={{ width: '100%' }}>
          Failed to update markers
        </Alert>
      </Snackbar>
    </div>
  );
}
