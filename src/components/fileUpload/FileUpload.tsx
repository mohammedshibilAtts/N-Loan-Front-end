import { useCallback, useState } from 'react';
import { useDropzone, FileRejection, Accept } from 'react-dropzone';
import { Box, Typography, Paper, SxProps, Theme, alpha, styled, Tabs, Tab } from '@mui/material';
import { fData } from '../../utils/commonFunction';

// ----------------------------------------------------------------------

const DropZoneWrapper = styled('div')(({ theme }) => ({
  outline: 'none',
  overflow: 'hidden',
  position: 'relative',
  padding: theme.spacing(5, 1),
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create('padding'),
  backgroundColor: theme.palette.background.neutral,
  // border: `1px dashed ${theme.palette.grey[500_32]}`,
  '&:hover': { opacity: 0.72, cursor: 'pointer' },
}));

// ----------------------------------------------------------------------

interface FileUploadProps {
  /** Callback when files are accepted */
  onUpload: (files: File[], fileType: 'image' | 'pdf') => void;
  /** Callback when files are rejected */
  onRejected?: (fileRejections: FileRejection[]) => void;
  /** Display text */
  placeholder?: string;
  /** Error state */
  error?: boolean;
  /** Additional styles */
  sx?: SxProps<Theme>;
}

export default function FileUpload({
  onUpload,
  onRejected,
  placeholder = 'Drag & drop files here or click to browse',
  error = false,
  sx,
}: FileUploadProps) {
  const [fileRejections, setFileRejections] = useState<FileRejection[]>([]);
  const [activeTab, setActiveTab] = useState<'image' | 'pdf'>('image');

  // File type configurations
  const fileConfig = {
    image: {
      accept: {
        'image/*': ['.svg', '.jpeg', '.jpg', '.png']
      },
      maxSize: 5 * 1024 * 1024, // 5MB
     
      label: 'Images (SVG, JPEG, PNG)'
    },
    pdf: {
      accept: {
        'application/pdf': ['.pdf']
      },
      maxSize: 10 * 1024 * 1024, // 10MB

      label: 'PDF Documents'
    }
  };

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (rejectedFiles.length > 0) {
        setFileRejections(rejectedFiles);
        onRejected?.(rejectedFiles);
      }

      if (acceptedFiles.length > 0) {
        onUpload(acceptedFiles, activeTab);
        setFileRejections([]);
      }
    },
    [onUpload, onRejected, activeTab]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    maxSize: fileConfig[activeTab].maxSize,
    accept: fileConfig[activeTab].accept as Accept,
    multiple: false,
  });

  return (
    <Box sx={{ width: '100%', ...sx }}>
      <Tabs 
        value={activeTab} 
        onChange={(_, newValue) => setActiveTab(newValue)}
        sx={{ mb: 2 }}
      >
        <Tab label="Upload Image" value="image" />
        <Tab label="Upload PDF" value="pdf" />
      </Tabs>

      <DropZoneWrapper
        {...getRootProps()}
        sx={{
          ...(isDragActive && { opacity: 0.72 }),
          ...((isDragReject || error) && {
            color: 'error.main',
            borderColor: 'error.light',
            bgcolor: 'error.lighter',
          }),
        }}
      >
        <input {...getInputProps()} />
        
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* {fileConfig[activeTab].icon} */}
          <Typography gutterBottom variant="body2">
            {placeholder}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {fileConfig[activeTab].label}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {`Max size: ${fData(fileConfig[activeTab].maxSize)}`}
          </Typography>
        </Box>
      </DropZoneWrapper>

      {fileRejections.length > 0 && (
        <Paper
          variant="outlined"
          sx={{
            py: 1,
            px: 2,
            mt: 2,
            borderColor: 'error.light',
            bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
          }}
        >
          {fileRejections.map(({ file, errors }) => (
            <Box key={file.name} sx={{ my: 1 }}>
              <Typography variant="subtitle2" noWrap>
                {file.name} - {fData(file.size)}
              </Typography>
              {errors.map((e) => (
                <Typography key={e.code} variant="caption" component="p">
                  - {e.message}
                </Typography>
              ))}
            </Box>
          ))}
        </Paper>
      )}
    </Box>
  );
}