import { Room } from '@mui/icons-material';
import { Typography, Slider, Input } from '@mui/material';
import { FilterSettings } from '../edit';
import { Dispatch, SetStateAction } from 'react';

interface MarkerLimitSliderProps {
  filterSettings: FilterSettings;
  totalMarkers: number;
  onChangeFilterSettings: Dispatch<SetStateAction<FilterSettings>>;
}

export function MarkerLimitSlider(props: MarkerLimitSliderProps) {
  const { filterSettings, totalMarkers, onChangeFilterSettings } = props;

  // handleChange is fired when the user edits the text inputs
  const handleChangeSliderLowInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value === '' ? 0 : Number(event.target.value);
    onChangeFilterSettings((prev) => ({ ...prev, markerLimit: [newValue, prev.markerLimit[1]] }));
  };

  const handleChangeSliderHighInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value === '' ? 0 : Number(event.target.value);
    onChangeFilterSettings((prev) => ({ ...prev, markerLimit: [prev.markerLimit[0], newValue] }));
  };

  // handleBlur is fired when the user clicks off the text inputs. We just want to set a bounds so users can't enter unintended values
  const handleBlurLowInput = () => {
    onChangeFilterSettings((prev) => {
      const low = Math.max(0, Math.min(prev.markerLimit[0], prev.markerLimit[1] - 1));
      return { ...prev, markerLimit: [low, prev.markerLimit[1]] };
    });
  };

  const handleBlurHighInput = () => {
    onChangeFilterSettings((prev) => {
      const high = Math.min(totalMarkers, Math.max(prev.markerLimit[1], prev.markerLimit[0] + 1));
      return { ...prev, markerLimit: [prev.markerLimit[0], high] };
    });
  };

  return (
    <div className='flex flex-col w-full mb-3'>
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
            max: filterSettings.markerLimit[1],
            type: 'number',
          }}
        />
        <Slider
          value={filterSettings.markerLimit}
          onChange={(_, value) => onChangeFilterSettings((prev) => ({ ...prev, markerLimit: value as number[] }))}
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
  );
}
