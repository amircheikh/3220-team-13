import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useEffect, useState } from 'react';
import { MapMarkerData } from '@/app/api/types';

interface EditMarkerDialogProps {
  open: boolean;
  marker?: MapMarkerData; // If marker is not passed in, we treat this screen as an 'Add Marker' screen
  onClose: VoidFunction;
  onSubmit: (newMarker: MapMarkerData) => Promise<void>;
}

// TODO: This screen is really slow when changing any field, especially typing. This is probably because we are updating the newMarker state every time the field is edited. FIND A BETTER WAY TO DO THIS!
export function EditMarkerDialog(props: EditMarkerDialogProps) {
  const { open, marker, onClose, onSubmit } = props;

  const emptyMarker = {} as MapMarkerData; // We use this empty marker when adding a new marker

  const [isLoading, setIsLoading] = useState(false); // Used to show loading circle when clicking submit (does this actually work? I don't see the loading circle???????)
  const [newMarker, setNewMarker] = useState<MapMarkerData>(marker ?? emptyMarker); // Marker state variable that gets updated when user edits a field

  // Helper function to update marker data in state
  const handleFieldChange = (field: keyof MapMarkerData, value: any) => {
    setNewMarker((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Updating coordinates is a little weird so we need this function to handle it (see comment in /app/api/types.ts)
  const handleCoordinateChange = (axis: 'x' | 'y', value: string) => {
    if (axis == 'x') {
      handleFieldChange('coordinates', [[value, newMarker.coordinates[0][1]]]);
    } else {
      handleFieldChange('coordinates', [[newMarker.coordinates[0][0], value]]);
    }
  };

  // Ran when clicking submit button
  const handleSubmit = async () => {
    setIsLoading(true);
    await onSubmit(newMarker);
    setIsLoading(false);
    onClose();
  };

  useEffect(() => {
    // Needed to reset marker when Dialog is opened or closed without saving
    if (marker) setNewMarker(marker);
    else setNewMarker(emptyMarker);
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{marker ? `Edit Marker: ${marker.id}` : 'Add Marker'}</DialogTitle>

      <DialogContent>
        <DialogContentText style={{ marginBottom: 16 }}>Use the form below to edit marker details.</DialogContentText>

        {/* Coordinates Section */}
        <Grid container spacing={2} alignItems='center'>
          <Grid size={6}>
            <TextField
              label='X Coordinate'
              type='number'
              value={newMarker.coordinates ? newMarker.coordinates[0][0] : ''} //see comment in /app/api/types.ts
              onChange={(e) => handleCoordinateChange('x', e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid size={6}>
            <TextField
              label='Y Coordinate'
              type='number'
              value={newMarker.coordinates ? newMarker.coordinates[0][1] : ''} //see comment in /app/api/types.ts
              onChange={(e) => handleCoordinateChange('y', e.target.value)}
              fullWidth
            />
          </Grid>
        </Grid>

        {/* isRedLightCamera */}
        <FormControlLabel
          control={
            <Switch
              checked={newMarker.isredlightcamera || false}
              onChange={(e) => handleFieldChange('isredlightcamera', e.target.checked)}
            />
          }
          label='Red Light Camera'
        />

        {/* Additional Info */}
        <TextField
          label='Additional Info'
          value={newMarker.additional_info || ''}
          onChange={(e) => handleFieldChange('additional_info', e.target.value)}
          fullWidth
          margin='normal'
        />

        {/* Advanced Fields */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>Advanced fields</AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {/* Boolean fields (uses switch component) */}
              {[
                'audiblepedsignal',
                'transit_preempt',
                'fire_preempt',
                'rail_preempt',
                'bicycle_signal',
                'ups',
                'led_blankout_sign',
              ].map((field) => (
                <Grid size={6} key={field}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={(newMarker[field as keyof MapMarkerData] as boolean) || false}
                        onChange={(e) => handleFieldChange(field as keyof MapMarkerData, e.target.checked)}
                      />
                    }
                    label={field}
                  />
                </Grid>
              ))}

              {/* Number fields (uses a small, number only text box component) */}
              {['px', 'numberofapproaches', 'objectid', 'geo_id', 'node_id', 'mi_prinx'].map((field) => (
                <Grid size={6} key={field}>
                  <TextField
                    label={field}
                    type='number'
                    value={newMarker[field as keyof MapMarkerData] || ''}
                    onChange={(e) => handleFieldChange(field as keyof MapMarkerData, Number(e.target.value))}
                    fullWidth
                  />
                </Grid>
              ))}

              {/* String fields (uses a bigger text box) */}
              {[
                'main_street',
                'midblock_route',
                'side1_street',
                'side2_street',
                'private_access',
                'signalsystem',
                'non_system',
                'control_mode',
                'pedwalkspeed',
                'aps_operation',
                'lpi_comment',
              ].map((field) => (
                <Grid size={12} key={field}>
                  <TextField
                    label={field}
                    value={newMarker[field as keyof MapMarkerData] || ''}
                    onChange={(e) => handleFieldChange(field as keyof MapMarkerData, e.target.value)}
                    fullWidth
                  />
                </Grid>
              ))}

              {/* Date fields

              TODO: MAKE DATE FIELDS WORK!: https://mui.com/x/react-date-pickers/getting-started/
              
              {[
                'activationdate',
                'lpi_north_implementation_date',
                'lpi_south_implementation_date',
                'lpi_east_implementation_date',
                'lpi_west_implementation_date',
              ].map((field) => (
                <Grid  size={12} key={field}>
                  <DatePicker
                    label={field}
                    value={
                      newMarker[field as keyof MapMarkerData]
                        ? new Date(newMarker[field as keyof MapMarkerData] as Date)
                        : null
                    }
                    onChange={(date) => handleFieldChange(field as keyof MapMarkerData, date)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </Grid>
              ))} */}
            </Grid>
          </AccordionDetails>
        </Accordion>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Nevermind</Button>
        <Button variant='contained' disabled={isLoading} onClick={handleSubmit}>
          {isLoading && <CircularProgress style={{ marginRight: 10 }} size={16} />}
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
