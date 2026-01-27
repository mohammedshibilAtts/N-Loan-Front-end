
import { useState } from "react";
import { useFormik } from "formik";
import { useValidation } from "../../validations/useValidation";
import { ValidationField } from "../../validations/schemaBuilder";
import Background from "../../../public/assets/background/LoginBg.png";
import LogoSvg from "../../../public/assets/images/Logo/Logo.svg";
// Background and logo images - replace with your actual paths

import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { Eye, EyeOff } from "lucide-react";
import { useLogin } from "./loginHook";

export default function SignInView() {
  const [showPassword, setShowPassword] = useState(false);

  const { login, loading } = useLogin();

  // Define validation fields
  const fields: ValidationField[] = [
    { name: "username", label: "Username", required: true, min: 1, max: 50 },
    {
      name: "password",
      label: "Password",
      required: true,
      min: 6,
      max: 50,
      type: "password",
    },
  ];

  // Generate initial values
  const initialValues = Object.fromEntries(
    fields.map(({ name }) => [name, ""])
  );

  // Get validation schema
  const validationSchema = useValidation(fields);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      login(values);
    },
  });

  return (
    <Box
      minHeight="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{
        backgroundImage: `url(${Background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: "1px",
      }}
    >
      <Container sx={{ width: "531px" }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: "16px" }}>
          <Box textAlign="center" mb={2}>
            <img
              src={LogoSvg}
              alt="Company Logo"
              style={{ width: "185px", display: "block", margin: "0 auto" }}
            />
          </Box>

          <Typography variant="h4" align="center" fontWeight={"700px"} mb={1}>
            Sign In
          </Typography>

          <Typography
            variant="body2"
            color="#737791"
            align="center"
            mb={3}
            sx={{ width: "80%", mx: "auto" }}
            fontWeight={"600px"}
            fontSize={"16px"}
          >
            Access your account using your username and password.
          </Typography>

          <form onSubmit={formik.handleSubmit}>
            {fields.map(({ name, label }) => (
              <Box key={name} mb={3}>
                <Typography variant="body2" fontWeight={500} mb={0.5}>
                  {label} <span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  id={name}
                  name={name}
                  type={
                    name === "password"
                      ? showPassword
                        ? "text"
                        : "password"
                      : "text"
                  }
                  placeholder={label}
                  value={formik.values[name]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched[name] && Boolean(formik.errors[name])}
                  helperText={formik.touched[name] && formik.errors[name]}
                  variant="outlined"
                  InputProps={
                    name === "password"
                      ? {
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword((show) => !show)}
                                edge="end"
                              >
                                {showPassword ? <Eye /> : <EyeOff />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }
                      : {}
                  }
                  sx={{
                    backgroundColor: "#f9fafb",
                    "& input:-webkit-autofill": {
                      WebkitBoxShadow: "0 0 0 1000px #f9fafb inset",
                      WebkitTextFillColor: "#000",
                      transition: "background-color 5000s ease-in-out 0s",
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor:
                          formik.touched[name] && formik.errors[name]
                            ? "#f44336"
                            : "#e5e7eb",
                      },
                      "&:hover fieldset": {
                        borderColor: "#60a5fa",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#3b82f6",
                        borderWidth: 2,
                      },
                    },
                  }}
                />
              </Box>
            ))}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.5,
                mt: 2,
                fontWeight: 500,
                textTransform: "none",
                borderRadius: 2,
                backgroundColor: "#09090F",
                "&:hover": {
                  backgroundColor: "#09091F",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
