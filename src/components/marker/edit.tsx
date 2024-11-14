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
  marker: MapMarkerData;
  onClose: VoidFunction;
  onSubmit: (newMarker: MapMarkerData) => Promise<void>;
  onDeleteMarker: (id: number) => Promise<void>;
}

/* 
NOTE: This component is used for both editing a marker and adding one. 
If a marker's id is provided, we treat this screen as 'editing' the marker. 
If id is not provided, we treat this screen as adding a marker.
The 'upsert-marker' endpoint will check if an id is provided and make the appropriate modifications to the database 
*/

export function EditMarkerDialog(props: EditMarkerDialogProps) {
  const { open, marker, onClose, onSubmit, onDeleteMarker } = props;

  const [isLoading, setIsLoading] = useState(false); // Used to show loading circle when clicking submit (does this actually work? I don't see the loading circle???????)
  const [newMarker, setNewMarker] = useState<MapMarkerData>(marker); // Marker state variable that gets updated when user edits a field

  // This boolean checks if the user enters both long and lat coordinates. Submit button is disabled when this is false
  const isCoordinatesSupplied =
    newMarker.coordinates !== null &&
    newMarker.coordinates[0] !== null &&
    newMarker.coordinates[0][0] !== '' &&
    newMarker.coordinates[0][1] !== '';

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
      handleFieldChange('coordinates', [[newMarker.coordinates[0][0], value]]);
    } else {
      handleFieldChange('coordinates', [[value, newMarker.coordinates[0][1]]]);
    }
  };

  // Ran when clicking submit button
  const handleSubmit = async () => {
    setIsLoading(true);
    await onSubmit(newMarker);
    setIsLoading(false);
    onClose();
  };

  const handleDeleteMarker = async () => {
    setIsLoading(true);
    await onDeleteMarker(newMarker.id!);
    setIsLoading(false);
    onClose();
  };

  useEffect(() => {
    // Needed to reset marker when Dialog is opened or closed without saving
    setNewMarker(marker);
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{marker && marker.id ? `Edit Marker: ${marker.id}` : 'Add Marker'}</DialogTitle>

      <DialogContent>
        <DialogContentText style={{ marginBottom: 16 }}>Use the form below to edit marker details.</DialogContentText>

        {/* Coordinates Section */}
        <Grid container spacing={2} alignItems='center'>
          <Grid size={6}>
            <TextField
              label='Latitude'
              type='number'
              value={newMarker.coordinates ? newMarker.coordinates[0][1] : ''} //see comment in /app/api/types.ts
              onChange={(e) => handleCoordinateChange('x', e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid size={6}>
            <TextField
              label='Longitude'
              type='number'
              value={newMarker.coordinates ? newMarker.coordinates[0][0] : ''} //see comment in /app/api/types.ts
              onChange={(e) => handleCoordinateChange('y', e.target.value)}
              fullWidth
            />
          </Grid>
        </Grid>

        {/* We only want to show this hint when the user doesn't enter coordinates */}
        {!isCoordinatesSupplied && (
          <DialogContentText style={{ marginTop: 4, fontStyle: 'italic', fontSize: 10 }}>
            Hint: You can also double click anywhere on the map to add a marker and autopopulate the coordinates
          </DialogContentText>
        )}

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

              {/* TODO: Add confirmation when clicking delete */}
              {newMarker.id && (
                <Grid size={12} display={'flex'} justifyContent={'center'}>
                  <Button variant='contained' color='error' onClick={handleDeleteMarker}>
                    Delete Marker: {newMarker.id}
                  </Button>
                </Grid>
              )}
            </Grid>
          </AccordionDetails>
        </Accordion>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Nevermind</Button>
        <Button variant='contained' disabled={isLoading || !isCoordinatesSupplied} onClick={handleSubmit}>
          {isLoading && <CircularProgress style={{ marginRight: 10 }} size={16} />}
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
