import { isString } from 'lodash';
import { Icon } from '@iconify/react';
import { FileRejection, useDropzone } from 'react-dropzone';
import roundAddAPhoto from '@iconify/icons-ic/round-add-a-photo';
import { alpha, styled, Box, Typography, Paper, SxProps, Theme } from '@mui/material';
import { useEffect, useRef } from 'react';
import { fData } from '../utils/commonFunction';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  width: 144,
  height: 144,
  margin: 'auto',
  borderRadius: '50%',
  padding: theme.spacing(1),
  border: `1px dashed ${theme.palette.grey[500]}`,
}));

const DropZoneStyle = styled('div')({
  zIndex: 0,
  width: '100%',
  height: '100%',
  outline: 'none',
  display: 'flex',
  overflow: 'hidden',
  borderRadius: '50%',
  position: 'relative',
  alignItems: 'center',
  justifyContent: 'center',
  '& > *': { width: '100%', height: '100%' },
  '&:hover': {
    cursor: 'pointer',
    '& .placeholder': {
      zIndex: 9,
    },
  },
});

const PlaceholderStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  position: 'absolute',
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.background.neutral,
  transition: theme.transitions.create('opacity', {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&:hover': { opacity: 0.72 },
}));

// ----------------------------------------------------------------------

interface UploadAvatarProps {
  error?: boolean;
  file?: string | File | null;
  hint?: string | null;
  caption?: React.ReactNode;
  sx?: SxProps<Theme>;
  onDrop?: (acceptedFiles: File[]) => void;
  onDropRejected?: (fileRejections: FileRejection[]) => void;
  onUpload?: (file: File) => void; // New prop for handling file upload
}

export default function UploadAvatar({
  error,
  file,
  hint,
  caption,
  sx,
  onDrop,
  onDropRejected,
  onUpload, // Destructure the new prop
  ...other
}: UploadAvatarProps) {
  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        if (onUpload) {
          onUpload(file); // Call the onUpload callback with the uploaded file
        }
        if (onDrop) {
          onDrop(acceptedFiles); // Call the onDrop callback if provided
        }
      }
    },
    onDropRejected,
    ...other,
  });

  const imageRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const input = document.querySelector('input');
    input?.addEventListener('click', () => {
      input.click();
    });
  }, []);

  // const selectImg = () => {
  //   imageRef.current?.click();
  // };

  const ShowRejectionItems = () => (
    <Paper
      variant="outlined"
      sx={{
        py: 1,
        px: 2,
        my: 2,
        borderColor: 'error.light',
        bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
      }}
    >
      {fileRejections.map(({ file, errors }) => {
        const { path, size } = file;
        return (
          <Box key={path} sx={{ my: 1 }}>
            <Typography variant="subtitle2" noWrap>
              {path} - {fData(size)}
            </Typography>
            {errors.map((e) => (
              <Typography key={e.code} variant="caption" component="p">
                - {e.message}
              </Typography>
            ))}
          </Box>
        );
      })}
    </Paper>
  );

  return (
    <>
      <RootStyle sx={sx}>
        <DropZoneStyle
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
          <input ref={imageRef} id="mcimg" {...getInputProps()} />

          {file && (
            <Box
              component="img"
              alt="avatar"
              src={isString(file) ? file : (file instanceof File ? URL.createObjectURL(file) : '')}
              sx={{ zIndex: 8, objectFit: 'cover' }}
            />
          )}

          <PlaceholderStyle
            className="placeholder"
            sx={{
              ...(file && {
                opacity: 0,
                color: 'common.white',
                bgcolor: 'grey.900',
                '&:hover': { opacity: 0.72 },
              }),
            }}
          >
            <Box component={Icon} icon={roundAddAPhoto} sx={{ width: 24, height: 24, mb: 1 }} />
            <Typography variant="caption">{hint || 'Upload Photo'}</Typography>
            {/* <Typography variant="caption">{file ? 'Update photo' : 'Upload photo'}</Typography> */}
          </PlaceholderStyle>
        </DropZoneStyle>
      </RootStyle>

      {caption}

      {fileRejections.length > 0 && <ShowRejectionItems />}
    </>
  );
}