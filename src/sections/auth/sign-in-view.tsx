// import { useEffect, useState } from 'react';
// import { useFormik } from 'formik';
// import { useValidation } from '../../validations/useValidation';
// import { ValidationField } from '../../validations/schemaBuilder';

// import Box from '@mui/material/Box';
// import TextField from '@mui/material/TextField';
// import IconButton from '@mui/material/IconButton';
// import InputAdornment from '@mui/material/InputAdornment';
// import LoadingButton from '@mui/lab/LoadingButton';
// import { Iconify } from '../../components/iconify';
// import { useRouter } from '../../routes/hooks';
// import { useDispatch, useSelector } from "react-redux";
// import { addUserInfo, apiClear, apiRequest } from '../../store/actions';
// import API_ENDPOINTS from '../../services/endpoints';
// import useToast from '../../components/toastr/toastr';
// // import Toast from "../../components/toastr/toastr";

// export function SignInView() {
//   const router = useRouter();
//   const [showPassword, setShowPassword] = useState(false);
//   const dispatch = useDispatch();
//   const { showToast,Toast } = useToast();

//   // Define fields with validation rules and labels
//   const fields: ValidationField[] = [
//     { name: 'username', label: 'Username', required: true, min: 1, max: 50, },
//     { name: 'password', label: 'Password', required: true, min: 6, max: 50, type: 'password' },
//   ];

//   // Generate initialValues dynamically from fields
//   const initialValues = Object.fromEntries(fields.map(({ name }) => [name, '']));

//   // Get validation schema based on fields
//   const validationSchema = useValidation(fields);

//   const formik = useFormik({
//     initialValues,
//     validationSchema,
//     onSubmit: (values) => {
//       dispatch(apiRequest("login", "post", API_ENDPOINTS.AUTH.LOGIN, values));
//     },
//   });

//   const loginState = useSelector((state: any) => state.login);
//   // const loginState = useSelector((state: any) => state.api.login);
//   const { data } = loginState || {};
//   useEffect(() => {
// // console.log(data);

//     if (data) {
//       if (data?.success == true) {
//         localStorage.setItem("accessToken", data.token);
//         console.log(data.data)
//         dispatch(addUserInfo(data.data))
//         router.push("/");
//       } else {
//         showToast({ message: data?.message, status: "error", isClose: true })
//       }

//       // dispatch(resetLoginState());
//       dispatch(apiClear("login"));

//     }
//   }, [data, router]);

//   return (
//     <Box component="form" onSubmit={formik.handleSubmit} display="flex" flexDirection="column" alignItems="flex-end">
//       {fields.map(({ name, label, type }) => (
//         <TextField
//           key={name}
//           fullWidth
//           name={name}
//           label={label}
//           type={name === 'password' ? (showPassword ? 'text' : 'password') : type || 'text'}
//           value={formik.values[name]}
//           onChange={formik.handleChange}
//           onBlur={formik.handleBlur}
//           error={formik.touched[name] && Boolean(formik.errors[name])}
//           helperText={formik.touched[name] && formik.errors[name]}
//           InputProps={
//             name === 'password'
//               ? {
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
//                       <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//               }
//               : undefined
//           }
//           sx={{ mb: 3 }}
//         />
//       ))}

//       <Toast />
//       <LoadingButton fullWidth size="large" type="submit" color="inherit" variant="contained">
//         Sign in
//       </LoadingButton>
//     </Box>
//   );
// }

import { useState, useEffect } from "react";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "../../routes/hooks";
import { addUserInfo, apiClear, apiRequest } from "../../store/actions";
import API_ENDPOINTS from "../../services/endpoints";
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
import { Toast } from "../../components/toast/toast";

export default function SignInView() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

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
      setIsLoading(true);
      dispatch(apiRequest("login", "post", API_ENDPOINTS.AUTH.LOGIN, values));
    },
  });

  const loginState = useSelector((state: any) => state.login);
  const { data } = loginState || {};

  useEffect(() => {
    if (data) {
      setIsLoading(false);
      if (data?.success === true) {
        localStorage.setItem("accessToken", data.token);
        dispatch(addUserInfo(data.data));
        router.push("/");
      } else {
        Toast.show({ message: data?.message || "Login failed", type: "error" });
      }
      dispatch(apiClear("login"));
    }
  }, [data, router, dispatch]);

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
              style={{ width:"185px", display: "block", margin: "0 auto" }}
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
              disabled={isLoading}
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
              {isLoading ? (
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
