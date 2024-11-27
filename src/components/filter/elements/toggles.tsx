import { Accordion, AccordionDetails, AccordionSummary, FormControlLabel, Switch, TextField } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FilterSettings } from '@/src/components/filter/edit';
import { Dispatch, SetStateAction } from 'react';
import Grid from '@mui/material/Grid2';

interface FilterOptionsProps {
  filterSettings: FilterSettings;
  onChangeFilterSettings: Dispatch<SetStateAction<FilterSettings>>;
}

export function ToggleFilterOptions(props: FilterOptionsProps) {


  return (
    <>
      {/* isRedLightCamera */}
      <FormControlLabel
        control={
          <Switch
            checked={props.filterSettings.data.isredlightcamera}
            onChange={(event) => props.onChangeFilterSettings((prev) => ({
              ...prev,
              data: {
                ...prev.data,
                isredlightcamera: event.target.checked,
              },
            }))}
            name="isRedLightCamera"
          />
        }
        label="Red Light Camera"
      />

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>Advanced Fields</AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            {/*  Boolean fields */}
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
                        checked={props.filterSettings.data[field as keyof FilterSettings['data']] as boolean || false}
                        onChange={(event) => props.onChangeFilterSettings((prev) => ({
                          ...prev,
                          data: {
                            ...prev.data,
                            [field]: event.target.checked,
                          },
                        }))}
                        name={field}
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
                  value={props.filterSettings.data[field as keyof FilterSettings['data']] || ''}
                  onChange={(event) => props.onChangeFilterSettings((prev) => ({
                    ...prev,
                    data: {
                      ...prev.data,
                      [field]: Number(event.target.value),
                    },
                  }))}
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
                  value={props.filterSettings.data[field as keyof FilterSettings['data']] || ''}
                  onChange={(event) => props.onChangeFilterSettings((prev) => ({
                    ...prev,
                    data: {
                      ...prev.data,
                      [field]: event.target.value,
                    },
                  }))}
                  fullWidth
                />
              </Grid>
            ))}

          </Grid>

        </AccordionDetails>
      </Accordion>
    </>
  );
}