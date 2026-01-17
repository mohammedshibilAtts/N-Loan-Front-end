import {  useEffect } from "react";
import {
  Box,
  Card,
  Grid,
  TextField,
  Typography,
  Autocomplete,
  InputLabel,
  InputAdornment,
  Button,
} from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import { Form, FormikProvider } from "formik";
import dayjs from "dayjs";
import "dayjs/locale/en";
import { Toast } from "../../../components/toast/toast";

import Page from "../../../components/Page";
import "react-toastify/dist/ReactToastify.css";
import { useBranch } from "../../settings/branch/branchHooks";
import { useLockerTransfer } from "./lockerTransferHook";

// Configure dayjs
dayjs.locale("en");

export default function FindLocker({
  title,
  handleTagId,
  hanldeClear,
  handleItem,
  formik,
}: any) {
  // const isEdit = pathname.includes('edit');

  const { branches, fetchBranches } = useBranch();
  const { findItemByTag } = useLockerTransfer();

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleSubmit = () => {
    if (!formik.values.branchId) {
      Toast.show({ message: "Branch is required", type: "error" });
      return;
    }

    if (String(formik.values.tagId).length! <= 4) {
      Toast.show({
        message: `Enter a valid Tag ID`,
        type: "error",
      });
      return;
    }

    findItemByTag(
      formik.values.tagId,
      formik.values.branchId,
      handleItem,
      handleTagId,
      hanldeClear
    );
  };

  return (
    <>
      <Page>
        <Box alignItems={"center"}>
          <FormikProvider value={formik}>
            <Form noValidate autoComplete="off" onSubmit={formik.handleSubmit}>
              <Card sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>
                  {title}
                </Typography>
                <Grid container spacing={6}>
                  {/* Branch Dropdown */}
                  <Grid item xs={12} md={6}>
                    <InputLabel
                      required
                      sx={{
                        "& .MuiInputLabel-asterisk": {
                          color: "red",
                        },
                        color: "black",
                        marginBottom: "12px",
                      }}
                    >
                      Branch
                    </InputLabel>
                    <Autocomplete
                      options={branches.map((branch) => ({
                        label: branch.branchName,
                        value: branch._id,
                      }))}
                      value={
                        branches
                          .map((branch) => ({
                            label: branch.branchName,
                            value: branch._id,
                          }))
                          .find(
                            (option) => option.value === formik.values.branchId
                          ) || null
                      }
                      onChange={(_, newValue) => {
                        formik.setFieldValue("branchId", newValue?.value || "");
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          size="small"
                          placeholder="Select branch"
                          error={
                            formik.touched.branchId &&
                            Boolean(formik.errors.branchId)
                          }
                          sx={{
                            "& .MuiInputBase-root": {
                              height: "48px", // Set desired height
                              borderRadius: "8px",
                              paddingRight: 0,
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>

                  {/* Tag ID with Search */}
                  <Grid item xs={12} md={6}>
                    <InputLabel
                      required
                      sx={{
                        "& .MuiInputLabel-asterisk": {
                          color: "red",
                        },
                        color: "black",
                        marginBottom: "12px",
                      }}
                    >
                      Tag ID
                    </InputLabel>

                    <TextField
                      fullWidth
                      name="tagId"
                      size="medium"
                      placeholder="Search Tag ID"
                      value={formik.values.tagId}
                      onChange={(e) => {
                        const input = e.target.value;
                        formik.setFieldValue("tagId", input.toUpperCase());
                      }}
                      error={
                        formik.touched.tagId && Boolean(formik.errors.tagId)
                      }
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end" sx={{ p: 0 }}>
                            <Button
                              disableElevation
                              variant="contained"
                              size="small"
                              sx={{
                                height: "48px",
                                borderRadius: "0px 8px 8px 0px",
                                backgroundColor: "black",
                                color: "#fff",
                                px: 2,
                                ml: 1,
                                minWidth: 0,
                                boxShadow: "none",
                                textTransform: "none",
                                fontWeight: 500,
                                "&:hover": {
                                  backgroundColor: "#333",
                                },
                              }}
                              onClick={handleSubmit}
                            >
                              Search
                            </Button>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiInputBase-root": {
                          height: "48px",
                          borderRadius: "8px",
                          paddingRight: 0,
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </Card>
            </Form>
          </FormikProvider>
        </Box>
      </Page>
    </>
  );
}
