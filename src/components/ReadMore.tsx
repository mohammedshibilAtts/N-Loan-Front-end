import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
  DialogTitle
} from '@mui/material';

// import { sentenceCase } from 'change-case';
import React, { useCallback, useState } from 'react';
// import Label from './Label';

// const DialogReadMore = ({ data, open, handleClose }) => (
//   <div>
//     <Dialog
//       open={open}
//       onClose={handleClose}
//       aria-labelledby="alert-dialog-title"
//       aria-describedby="alert-dialog-description"
//     >
//       <DialogTitle id="alert-dialog-title">Use Google's location service?</DialogTitle>
//       <DialogContent>
//         <DialogContentText id="alert-dialog-description">{data}</DialogContentText>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={(handleClose)} autoFocus>
//           Close
//         </Button>
//       </DialogActions>
//     </Dialog>
//   </div>
// );

const ReadMore = ({ data, heading }:any) => {
//   console.log('read more render');
  const [open, setOpen] = useState(false);

  const handleClose = useCallback(() => {
    console.log('close');
    setOpen(false);
  }, [open]);

  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

  return (
    <>
      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{heading}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">{data}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} autoFocus variant="contained" color="error">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      {/* {sentenceCase(data).length > 30 ? (
        <Label onClick={handleClickOpen}>
          {sentenceCase(data).substring(0, 30)}{' '} */}
          {/* <DialogReadMore data={data} open={open} handleClose={handleClose} /> */}
          {/* <Button variant="text" color="primary">
            Read More...
          </Button>{' '}
        </Label> */}
      {/* ) : (
        <Label >{sentenceCase(data)}</Label>
      ) */}
      {/* } */}
    </>
  );
};

export default React.memo(ReadMore);
