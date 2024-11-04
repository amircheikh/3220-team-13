import { MapMarkerData } from '@/app/api/types';
import { EditLocationAlt } from '@mui/icons-material';
import { IconButton, Portal } from '@mui/material';
import { PopupProps as RLPopupProps, Popup as RLPopup } from 'react-leaflet';

interface PopupProps extends RLPopupProps {
  markerData: MapMarkerData;
  onEditMarker: (maker: MapMarkerData) => void;
}

export function Popup(props: PopupProps) {
  const { markerData, onEditMarker } = props;

  return (
    <RLPopup closeButton={false} {...props}>
      <div className='flex items-center gap-1'>
        <h1 className='text-2xl'>Marker Details</h1>
        <IconButton onClick={() => onEditMarker(markerData)}>
          <EditLocationAlt />
        </IconButton>
      </div>

      <ul className='mt-1.5 space-y-1 max-h-60 overflow-y-scroll'>
        {Object.entries(markerData).map(([key, value]) => (
          <li key={key}>
            <div>
              <strong>{key}</strong>: {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}
            </div>
          </li>
        ))}
      </ul>
    </RLPopup>
  );
}
