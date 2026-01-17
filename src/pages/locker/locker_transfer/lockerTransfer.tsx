import {
  Autocomplete,
  Box,
  Button,
  Card,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

import { itemType } from "../../manageLoan/loanTopUp/loanTopUp";
import { Breadcrumb } from "../../../components/breadCrumbComp";
import FindLocker from "./findLocker";
import SubTable from "../../../components/subTable/subTable";

import { InputLabel } from "@mui/material";
import { Toast } from "../../../components/toast/toast";
import { useFormik } from "formik";
import { useLocker } from "../../settings/lockerCreation/lockerHooks";
import { useLockerTransfer } from "./lockerTransferHook";

function LockerTransfer() {
  const { fetchLockers, lockers } = useLocker();
  const { lockerTransfer } = useLockerTransfer();
  const [itemData, setItemData] = useState<itemType[]>([]);
  const [tagId, setTagId] = useState<string>("");
  // const [branchId, setBranchId] = useState<string>("");
  const [currentLocker, setCurrentLocker] = useState<any>({});
  const [selectedLocker, setSelectedLocker] = useState<any>(null);

  const formik = useFormik({
    initialValues: {
      branchId: "",
      tagId: "",
    },
    onSubmit: () => {},
  });

  useEffect(() => {
    fetchLockers();
  }, []);

  const handletagId = (tagId: string) => {
    setTagId(tagId);
  };

  const handleItem = (data: any) => {
    console.log(data);
    setItemData(data);
    setCurrentLocker(data[0].lockerId);
  };

  // const handleBranchId = (id: string) => {
  //   setBranchId(id);
  // };

  const coloums = [
    { id: "id", label: "S.NO" },
    { id: "metal", label: "metal" },
    { id: "Purity", label: "Purity" },
    { id: "Item Type", label: "Item Type" },
    { id: "Gross wt", label: "Gross wt" },
    { id: "Net wt", label: "Net WT" },
    { id: "Quantity", label: "Quantity" },
  ];

  const columnsData = itemData?.map((item: any, index: any) => ({
    id: index + 1, // S.NO
    metal: item?.metalId?.metalName,
    Purity: item?.purityId?.purityName,
    "Item Type": item?.itemId?.itemName,
    "Gross wt": item?.grossWt,
    "Net wt": item?.netWt,
    Quantity: item?.quantity,
  }));

  const hanldeSubmit = async () => {
    try {
      if (!selectedLocker.value) {
        Toast.show({
          message: "Please select a locker",
          type: "error",
        });
      }
      if (currentLocker._id == selectedLocker.value) {
        Toast.show({
          message: "Please select a different locker to update.",
          type: "error",
        });
        return;
      }

      const update = await lockerTransfer({
        lockerId: selectedLocker.value,
        itemDetailId: itemData[0]._id,
      });
      if (update) {
        setCurrentLocker({
          _id: selectedLocker.value,
          lockerName: selectedLocker.label,
        });
        setSelectedLocker(null);
      }
    } catch (err) {
      Toast.show({ message: "Failed to update locker", type: "error" });
    }
  };

  const hanldeClear = () => {
    setItemData([]);
    setTagId("");
    // setBranchId("");
    setCurrentLocker({});
    setSelectedLocker(null);
    formik.resetForm();
  };

  const isValidId = () => {
    setTagId("");
    setItemData([]);
  };

  return (
    <>
      <Box px={5}>
        <Stack direction="row" alignItems="center" mb={3}>
          <Breadcrumb
            items={[
              { label: "Locker" },
              { label: "Locker Transfer", active: true },
            ]}
          />
        </Stack>

        <FindLocker
          title="Locker Transfer"
          formik={formik}
          handleTagId={handletagId}
          // handleBranch={handleBranchId}
          handleItem={handleItem}
          hanldeClear={isValidId}
        />

        {tagId && (
          <>
            <Card sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                  <Box sx={{ p: 3 }}>
                    <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>
                      Item Details
                    </Typography>

                    <SubTable
                      hidePagination={true}
                      coloums={coloums}
                      data={columnsData}
                      action={false}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Card>

            <Card sx={{ mt: 2, my: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                  <Box sx={{ p: 3 }}>
                    <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>
                      Update Locker
                    </Typography>

                    <Grid container spacing={3}>
                      {/* Left side: Current Locker info */}
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
                          Current Locker
                        </InputLabel>
                        <Box
                          sx={{
                            p: 2,
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            backgroundColor: "#f5f5f5",
                          }}
                        >
                          <Typography sx={{}}>
                            {currentLocker?.lockerName
                              ? currentLocker.lockerName
                              : "No locker selected"}
                          </Typography>
                        </Box>
                      </Grid>

                      {/* Right side: Dropdown for updating locker */}
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
                          Select New Locker
                        </InputLabel>

                        <Autocomplete
                          options={lockers?.map((option: any) => ({
                            label: option.lockerName,
                            value: option._id,
                          }))}
                          value={selectedLocker}
                          onChange={(_, value) => {
                            setSelectedLocker(value);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select Locker"
                            />
                          )}
                          slotProps={{
                            popper: {
                              modifiers: [
                                {
                                  name: "customStyle",
                                  enabled: true,
                                  phase: "beforeWrite",
                                  fn: ({ state }) => {
                                    Object.assign(state.styles.popper, {
                                      boxShadow:
                                        "0px 10px 30px 0px rgba(64,100,233,0.15)",
                                    });
                                  },
                                },
                              ],
                            },
                          }}
                        />
                      </Grid>
                    </Grid>

                    <Box
                      pt={3}
                      display="flex"
                      alignItems="center"
                      justifyContent="end"
                      gap={2} // optional, for some breathing space
                    >
                      <Box display="flex" gap={1}>
                        <Button
                          sx={{
                            backgroundColor: "#F5F5F5",
                            color: "#000",
                            textTransform: "none",
                            px: 3,
                          }}
                          type="button"
                          className="border-2 border-gray-800 text-[#344054] font-medium"
                          onClick={hanldeClear}
                        >
                          Clear
                        </Button>
                        <Button
                          onClick={hanldeSubmit}
                          variant="contained"
                          sx={{
                            bgcolor: "black",
                            color: "white",
                            "&:hover": {
                              bgcolor: "#333",
                            },
                          }}
                          disabled={currentLocker._id == selectedLocker?.value}
                        >
                          Update
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Card>
          </>
        )}
      </Box>
    </>
  );
}
export default LockerTransfer;
