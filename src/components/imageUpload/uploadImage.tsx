import React, { useRef, useState } from "react";
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { Trash2, Camera } from "lucide-react";
import Webcam from "react-webcam";
import { Toast } from "../toast/toast";

interface ImageUploadProps {
  label?: string;
  onChange: (file: File | null) => void;
  initialImage?: string;
  maxSizeInKB?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onChange,
  initialImage,
  maxSizeInKB = 500,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const webcamRef = useRef<Webcam>(null);
  const [preview, setPreview] = useState<string | null>(initialImage || null);
  const [openCamera, setOpenCamera] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<"granted" | "denied" | "pending">("pending");

const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (file) {
    const allowedImageTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/svg+xml",
    ];

    if (!allowedImageTypes.includes(file.type)) {
      Toast.show({
        message: "Only image files (JPG, PNG, WEBP, SVG) are allowed.",
        type: "error",
      });
      return;
    }

    if (file.size > maxSizeInKB * 1024) {
      Toast.show({
        message: `Image must be less than ${maxSizeInKB}KB.`,
        type: "error",
      });
      return;
    }

    const imageURL = URL.createObjectURL(file);
    setPreview(imageURL);
    onChange(file);
  }
};


  const handleRemove = () => {
    setPreview(null);
    onChange(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const captureFromWebcam = async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      const response = await fetch(imageSrc);
      const blob = await response.blob();

      if (blob.size > maxSizeInKB * 1024) {
        Toast.show({
          message: `Captured image must be less than ${maxSizeInKB}KB.`,
          type: "error",
        });
        return;
      }

      const file = new File([blob], "webcam-image.png", { type: "image/png" });
      setPreview(imageSrc);
      onChange(file);
      setOpenCamera(false);
    }
  };

  const handleOpenCamera = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setCameraPermission("pending");
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop()); // Close immediately
      setCameraPermission("granted");
      setOpenCamera(true);
    } catch (err) {
      setCameraPermission("denied");
      Toast.show({
        message: "Camera access denied. Please allow permission to use the webcam.",
        type: "error",
      });
    }
  };

  return (
    <>
      <Box display="flex" flexDirection="column" gap={1}>
        <input
          type="file"
          accept="image/*"
          hidden
          ref={fileInputRef}
          onChange={handleImageChange}
        />

        <Box display="flex" alignItems="center" gap={2}>
          <TextField
            value={preview ? "Browse" : ""}
            placeholder="Browse"
            fullWidth
            onClick={() => fileInputRef.current?.click()}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <Box
                    bgcolor={"black"}
                    borderRadius={1}
                    py={1}
                    px={1}
                    marginRight={-1.5}
                    onClick={handleOpenCamera}
                  >
                    <IconButton sx={{ backgroundColor: "#09090F", color: "#fff" }}>
                      <Camera size={20} />
                    </IconButton>
                  </Box>
                </InputAdornment>
              ),
            }}
          />

          {preview && (
            <IconButton onClick={handleRemove} color="error">
              <Trash2 />
            </IconButton>
          )}
        </Box>

        {preview && (
          <Box
            mt={1}
            component="img"
            src={preview}
            alt="Preview"
            sx={{
              width: 150,
              height: 150,
              objectFit: "cover",
              borderRadius: 2,
            }}
          />
        )}
      </Box>

      <Dialog open={openCamera} onClose={() => setOpenCamera(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Capture Photo</DialogTitle>
        <DialogContent dividers>
          {cameraPermission === "granted" ? (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/png"
              videoConstraints={{ width: 320, height: 200 }}
              style={{ width: "100%" }}
            />
          ) : (
            <Box textAlign="center" p={2}>
              <p>Waiting for camera permission...</p>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCamera(false)} sx={{ color: "black" }}>
            Cancel
          </Button>
          <Button
            onClick={captureFromWebcam}
            sx={{ color: "white", bgcolor: "black" }}
            variant="contained"
            disabled={cameraPermission !== "granted"}
          >
            Capture
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ImageUpload;
