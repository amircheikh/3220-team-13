import { MapMarkerData } from '@/app/api/types';
import { EditLocationAlt } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { PopupProps as RLPopupProps, Popup as RLPopup } from 'react-leaflet';

interface PopupProps extends RLPopupProps {
  markerData: MapMarkerData;
  onEditMarker: (maker: MapMarkerData) => void;
}

export function Popup(props: PopupProps) {
  const { markerData, onEditMarker } = props;

  return (
    <RLPopup closeButton={false} {...props}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <h6>Marker Details</h6>
        <IconButton onClick={() => onEditMarker(markerData)}>
          <EditLocationAlt />
        </IconButton>
      </div>

      <ul style={{ marginTop: 6, maxHeight: 240, overflowY: 'scroll' }}>
        {Object.entries(markerData).map(([key, value]) => (
          <li style={{ marginTop: 2 }} key={key}>
            <div>
              <strong>{key}</strong>: {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}
            </div>
          </li>
        ))}
      </ul>
    </RLPopup>
  );
}
