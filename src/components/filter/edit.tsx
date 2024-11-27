import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { MarkerLimitSlider } from './elements/limit-slider';
// import { MapMarkerData } from '@/app/api/types';
import { ToggleFilterOptions } from '@/src/components/filter/elements/toggles';

export interface FilterSettings {
  markerLimit: number[],
  data: {
    id?: number | null;
    px: number | null;
    main_street: string;
    midblock_route: string;
    side1_street: string;
    side2_street: string;
    private_access: string;
    additional_info: string;
    activationdate: Date | null;
    signalsystem: string;
    non_system: string;
    control_mode: string;
    pedwalkspeed: string;
    aps_operation: string;
    numberofapproaches: number | null;
    objectid: number | null;
    geo_id: number | null;
    node_id: number | null;
    audiblepedsignal: boolean;
    transit_preempt: boolean;
    fire_preempt: boolean;
    rail_preempt: boolean;
    mi_prinx: number | null;
    bicycle_signal: boolean;
    ups: boolean;
    led_blankout_sign: boolean;
    lpi_north_implementation_date: Date | null;
    lpi_south_implementation_date: Date | null;
    lpi_east_implementation_date: Date | null;
    lpi_west_implementation_date: Date | null;
    lpi_comment: string;
    coordinates: string;
    isredlightcamera: boolean;
    isuseradded: boolean;
  }
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

  const [filterSettings, setFilterSettings] = useState<FilterSettings>(() => {
    const savedSettings = localStorage.getItem('filterSettings');
    console.log("Saved settings", savedSettings
    )
    return savedSettings ? JSON.parse(savedSettings) : currentFilterSettings;
  });

  useEffect(() => {
    if (open) {
      setFilterSettings(currentFilterSettings);
    }
  }, [open, currentFilterSettings]);

  useEffect(() => {
    try {
      localStorage.setItem('filterSettings', JSON.stringify(filterSettings));
      console.log('Filter settings saved:', filterSettings);
    } catch (error) {
      console.error('Error saving filter settings to localStorage:', error);
    }
  }, [filterSettings]);

  const handleReset = () => {
    setFilterSettings({
      markerLimit: [0, 300],
      data: {
        
      }
    });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Filter Settings</DialogTitle>
      <DialogContent>
        <>
          <MarkerLimitSlider
            filterSettings={filterSettings}
            totalMarkers={totalMarkers}
            onChangeFilterSettings={setFilterSettings}
          />
          <ToggleFilterOptions
            filterSettings={filterSettings}
            onChangeFilterSettings={setFilterSettings}
          />
        </>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleReset} color="secondary">Reset</Button>
        <Button onClick={onClose}>Close</Button>
        <Button variant="contained" onClick={() => onSubmit(filterSettings)}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
