import { MapMarkerData } from '@/app/api/types';
import { useEffect, useState } from 'react';
import { Map } from './screen';
import { getApiEndpoint } from '@/app/api/utils';

export default function MapWithQuery() {
  const [markers, setMarkers] = useState<MapMarkerData[]>();
  const baseUrl = getApiEndpoint();

  //TODO: Instead of specifying count when querying, query for all markers, then have the user select how many the want to display with a slider or something. Limit the inital amount displayed to like 300 or something since displaying all 2500+ is really laggy...

  const queryMarkers = () => {
    fetch(`${baseUrl}/api/get-markers?count=300`) //TODO: Remove count. See comment about
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
