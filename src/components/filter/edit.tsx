import { Room } from '@mui/icons-material';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Slider, Input } from '@mui/material';
import { useEffect, useState } from 'react';

export interface FilterSettings {
  markerLimit: number[];
}

interface EditFilterDialogProps {
  open: boolean;
  currentFilterSettings: FilterSettings;
  totalMarkers: number;
  onClose: VoidFunction;
  onSubmit: (filterSettings: FilterSettings) => void;
}

export function EditFilterDialog(props: EditFilterDialogProps) {
  const { open, currentFilterSettings, totalMarkers, onClose, onSubmit } = props;

  const [filterSettings, setFilterSettings] = useState<FilterSettings>(currentFilterSettings);

  // handleChange is fired when the user edits the text inputs
  const handleChangeSliderLowInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value === '' ? 0 : Number(event.target.value);
    setFilterSettings((prev) => ({ ...prev, markerLimit: [newValue, prev.markerLimit[1]] }));
  };

  const handleChangeSliderHighInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value === '' ? 0 : Number(event.target.value);
    setFilterSettings((prev) => ({ ...prev, markerLimit: [prev.markerLimit[0], newValue] }));
  };

  // handleBlur is fired when the user clicks off the text inputs. We just want to set a bounds so users can't enter unintended values
  const handleBlurLowInput = () => {
    setFilterSettings((prev) => {
      const low = Math.max(0, Math.min(prev.markerLimit[0], prev.markerLimit[1] - 1));
      return { ...prev, markerLimit: [low, prev.markerLimit[1]] };
    });
  };

  const handleBlurHighInput = () => {
    setFilterSettings((prev) => {
      const high = Math.min(totalMarkers, Math.max(prev.markerLimit[1], prev.markerLimit[0] + 1));
      return { ...prev, markerLimit: [prev.markerLimit[0], high] };
    });
  };

  useEffect(() => {
    // Edge case to reset the filterSettings after user clicks 'close' (doesn't save the settings)
    if (open) setFilterSettings(currentFilterSettings);
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Filter Settings</DialogTitle>

      <DialogContent>
        <div className='flex flex-col w-96'>
          <Typography gutterBottom>Markers shown</Typography>
          <div className='flex flex-row space-x-4'>
            <Room />
            <Input
              style={{ width: 100 }}
              value={filterSettings.markerLimit[0]}
              size='small'
              onChange={handleChangeSliderLowInput}
              onBlur={handleBlurLowInput}
              inputProps={{
                step: 10,
                min: 0,
                max: 100,
                type: 'number',
              }}
            />
            <Slider
              value={filterSettings.markerLimit}
              onChange={(_, value) => setFilterSettings((prev) => ({ ...prev, markerLimit: value as number[] }))}
              valueLabelDisplay='auto'
              disableSwap
              min={0}
              max={totalMarkers}
            />
            <Input
              style={{ width: 100 }}
              value={filterSettings.markerLimit[1]}
              size='small'
              onChange={handleChangeSliderHighInput}
              onBlur={handleBlurHighInput}
              inputProps={{
                step: 10,
                min: filterSettings.markerLimit[0],
                max: totalMarkers,
                type: 'number',
              }}
            />
          </div>
        </div>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button variant='contained' onClick={() => onSubmit(filterSettings)}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
