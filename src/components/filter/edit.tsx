import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { MarkerLimitSlider } from './elements/limit-slider';

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

  useEffect(() => {
    // Edge case to reset the filterSettings after user clicks 'close' (doesn't save the settings)
    if (open) setFilterSettings(currentFilterSettings);
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Filter Settings</DialogTitle>

      <DialogContent>
        <MarkerLimitSlider
          filterSettings={filterSettings}
          totalMarkers={totalMarkers}
          onChangeFilterSettings={setFilterSettings}
        />
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
