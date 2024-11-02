import { MapMarkerData } from '@/app/api/types';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

interface EditMarkerDialogProps {
  open: boolean;
  marker?: MapMarkerData;
  onClose: VoidFunction;
}

export function EditMarkerDialog(props: EditMarkerDialogProps) {
  const { open, onClose } = props;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Marker</DialogTitle>

      <DialogContent>
        <DialogContentText>Editing markers is coming soon</DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Nevermind</Button>
        <Button variant='contained' onClick={onClose}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
