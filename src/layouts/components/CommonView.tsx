import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  IconButton, 
  Box
} from '@mui/material';
import { X } from 'lucide-react';

interface SimpleModalProps {
  open: boolean;
  maxWidth:string;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const CommonView: React.FC<SimpleModalProps> = ({
  open,
  onClose,
  title,
  children
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        style: {
          borderRadius: '8px',
        }
      }}
    >
      <DialogTitle >
        <Box style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ margin: 0 }}>{title}</h3>
          <IconButton 
            onClick={onClose}
            style={{ padding: 0 }}
          >
            <X size={18}/>
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent style={{ padding: '16px 0' }}>
        {children}
      </DialogContent>
    </Dialog>
  );
};