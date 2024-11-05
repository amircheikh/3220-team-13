import { MapMarkerData } from '@/app/api/types';
import { useEffect, useState } from 'react';
import { Map } from './screen';
import { getApiEndpoint } from '@/app/api/utils';

export default function MapWithQuery() {
  const [markers, setMarkers] = useState<MapMarkerData[]>();
  const baseUrl = getApiEndpoint();

  const queryMarkers = () => {
    fetch(`${baseUrl}/api/get-markers`)
      .then((response) => response.json())
      .then((data) => {
        setMarkers(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    queryMarkers();
  }, []);

  return <Map markers={markers} />;
}
