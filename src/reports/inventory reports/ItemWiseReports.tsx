import { Helmet } from 'react-helmet-async';
import { CONFIG } from '../../config-global';
import { DataTable } from '../../components/datatable/datatableComp';
import API_ENDPOINTS from '../../services/endpoints';
import { ITEM_TABLE, METAL_LIST, THIRD_PARTY_LOCKER, SHOP_LOCKER, PURITY_LIST, BRANCH_LIST, ITEM_LIST } from '../../store/actionTypes';
import { DashboardContent } from '../../layouts/dashboard';
import { Autocomplete, Box, Grid, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import shoplocker from "../../../src-tauri/icons/shoplocker.svg"
import lockerimg from "../../../src-tauri/icons/lockerImgItem.svg"
import { useDispatch, useSelector } from 'react-redux';
import { apiRequest } from '../../store/actions';
import { ChevronDown } from 'lucide-react';
import { formatNumber } from '../../utils/commonFunction';
import { ValidationField } from "../../validations/schemaBuilder";


interface Locker {
    totalItems?: number;
    totalNetWt?: number;
    totalCurrentValue?: number;
}

interface ItemWiseFilterProps {
    onFilterChange: (fieldName: string, value: any) => void;
  }

function ItemWiseReports() {

    const [metals, setMetals] = useState<{ metalName: string; _id: string }[]>([]);
    const [metalId, setMetalId] = useState<string | null>(null);

    const [lockerMetalId, setlockerMetalId] = useState<string | null>(null);
    const [shoplockerData, setShopLockerData] = useState<Locker>();
    const [thirdPartyData, setThirdPartyData] = useState<Locker>();





    // const [filterValues, setFilterValues] = useState<{ [key: string]: any }>({});

    const dispatch = useDispatch();

    const { metalList, shopLocker, thirdParty } = useSelector((states: any) => ({
        metalList: states[METAL_LIST]?.data,
        shopLocker: states[SHOP_LOCKER]?.data,
        thirdParty: states[THIRD_PARTY_LOCKER]?.data,

    }));


    useEffect(() => {
        dispatch(
            apiRequest(METAL_LIST, "post", API_ENDPOINTS.SP.POST, {
                procedureName: "findAll",
                params: { tableName: "metal" },
            })
        );

    }, []);



    useEffect(() => {

        if (!metalId && !lockerMetalId) return;

        if (metalId) {
            dispatch(
                apiRequest(SHOP_LOCKER, "post", API_ENDPOINTS.SP.POST, {
                    procedureName: "shopLocker",
                    params: {
                        tableName: "itemDetail", table_type: "reports",
                        filters: {
                            metalId: metalId
                        }
                    },
                })
            );
        }

        if (lockerMetalId) {
            dispatch(
                apiRequest(THIRD_PARTY_LOCKER, "post", API_ENDPOINTS.SP.POST, {
                    procedureName: "thirdPartyLocker",
                    params: {
                        tableName: "itemDetail", table_type: "reports",
                        filters: {
                            metalId: lockerMetalId
                        }
                    },
                })
            );
        }


    }, [metalId, lockerMetalId]);


    useEffect(() => {
        if (shopLocker?.success) {
            const Data = shopLocker?.data?.data;
            setShopLockerData(Data)
        }


        if (thirdParty?.success) {
            const Data = thirdParty?.data?.data;
            setThirdPartyData(Data)
        }

    }, [shopLocker, thirdParty]);




    useEffect(() => {
        if (metalList?.success) {
            const metalsData = metalList?.data?.data;
            setMetals(metalsData);
            const length = metalsData.length - 1;


            const initialmetalId: any = {
                label: metalsData[length]?.metalName,
                value: metalsData[length]?._id
            }

            if (metalsData.length > 0 && !metalId) {
                setMetalId(initialmetalId.value);
                setlockerMetalId(initialmetalId.value)
            }
        }
    }, [metalList]);


    const getOptionsForField = (fieldName: string) => {
        switch (fieldName) {
            case "metals":
            case "metalId":
                return metals.map((option) => ({
                    label: option.metalName,
                    value: option._id,
                }));
            default:
                return [];
        }

    };



    return (
        <>
            <Helmet>
                <title>{`Users - ${CONFIG.appName}`}</title>
            </Helmet>

            <DashboardContent>
                <Box display="flex" alignItems="center" mb={5}>
                    <Typography variant="h6" flexGrow={1} marginLeft={2}>
                        <span className='text-[#737791]'>Inventory</span> / Item Wise Report
                    </Typography>
                </Box>

                <Box>
                    <Grid container mb={2} gap={3}>
                        <Grid item xs={12} sm={6} md={3}>
                            <Box
                                p={2}
                                borderRadius={2}
                                border={1}
                                borderColor="#F2F2F9"
                                bgcolor="white"
                                height={200}
                            // width={280}
                            >
                                <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                                    <Box
                                        component="img"
                                        src={shoplocker}
                                        alt="shoplocker"
                                        sx={{
                                            width: 35,
                                            height: 35,
                                        }}
                                    />

                                    <Autocomplete
                                        options={getOptionsForField("metals")}
                                        value={getOptionsForField("metals").find((o) => o.value === metalId) || null}
                                        onChange={(_, value) => setMetalId(value?.value || null)}

                                        popupIcon={<ChevronDown size={20} color="#000" />}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                placeholder="Select metal"
                                                variant="outlined"
                                                InputProps={{
                                                    ...params.InputProps,
                                                    disableUnderline: true,
                                                    sx: {
                                                        padding: '0 !important',
                                                        margin: 0,
                                                        alignItems: 'center',
                                                    },
                                                }}
                                                sx={{
                                                    "& .MuiOutlinedInput-root": {
                                                        borderRadius: 2,
                                                        border: '2px solid #F5F5F5',
                                                        padding: '0 5px',
                                                        height: 44,
                                                        gap: 0,

                                                    },
                                                    "& .MuiInputBase-input": {
                                                        fontWeight: 600,
                                                        fontSize: "16px",
                                                        padding: '0 !important',
                                                        marginRight: '0px',
                                                        "&::placeholder": {
                                                            color: "#000",
                                                            opacity: 1,
                                                            fontWeight: 500,
                                                            fontSize: "16px",
                                                        },
                                                    },
                                                    "& .MuiOutlinedInput-notchedOutline": {
                                                        border: "none",
                                                    },
                                                    "& .MuiAutocomplete-endAdornment": {
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                    },
                                                }}
                                            />
                                        )}
                                        sx={{
                                            width: 135,
                                            "& .MuiAutocomplete-inputRoot": {
                                                display: 'flex',
                                                alignItems: 'center',
                                            },
                                        }}
                                    />

                                </Box>

                                <Typography variant="h6" py={1}>Shop</Typography>
                                <Box display="flex" flexDirection="column" gap={1}>

                                    <Box display="flex" flexDirection="row" gap={2}>
                                        <Typography fontWeight={500} sx={{ color: "#6C7086" }}>Count:</Typography>
                                        <Typography fontWeight={500}>{shoplockerData?.totalItems || 0}</Typography>
                                    </Box>

                                    <Box display="flex" flexDirection="row" gap={2}>
                                        <Typography fontWeight={500} sx={{ color: "#6C7086" }}>Weight:</Typography>
                                        <Typography fontWeight={500}>{formatNumber({ value: shoplockerData?.totalNetWt, currency: null })}g</Typography>
                                    </Box>

                                    <Box display="flex" flexDirection="row" gap={2}>
                                        <Typography fontWeight={500} sx={{ color: "#6C7086" }}>Amount:</Typography>
                                        <Typography fontWeight={500}>{formatNumber({ value: shoplockerData?.totalCurrentValue, decimalPlaces: 0 })}</Typography>
                                    </Box>

                                </Box>
                            </Box>


                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <Box
                                p={2}
                                borderRadius={2}
                                border={1}
                                borderColor="#F2F2F9"
                                bgcolor="white"
                                height={200}
                            // width={280}
                            >
                                <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                                    <Box
                                        component="img"
                                        src={lockerimg}
                                        alt="lockerimg"
                                        sx={{
                                            width: 35,
                                            height: 35,
                                        }}
                                    />

                                    <Autocomplete
                                        options={getOptionsForField("metals")}
                                        value={(() => {
                                            const selectedOption = metals.find(
                                                (option: { metalName: string; _id: string }) =>
                                                    option._id === lockerMetalId || ""
                                            );
                                            return selectedOption
                                                ? {
                                                    label: selectedOption.metalName,
                                                    value: selectedOption._id,
                                                }
                                                : null;
                                        })()}
                                        onChange={(_, value) => {
                                            setlockerMetalId(value?.value || "");
                                        }}
                                        popupIcon={<ChevronDown size={20} color="#000" />}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                placeholder="Select metal"
                                                variant="outlined"
                                                InputProps={{
                                                    ...params.InputProps,
                                                    disableUnderline: true,
                                                    sx: {
                                                        padding: '0 !important',
                                                        margin: 0,
                                                        alignItems: 'center',
                                                    },
                                                }}
                                                sx={{
                                                    "& .MuiOutlinedInput-root": {
                                                        borderRadius: 2,
                                                        border: '2px solid #F5F5F5',
                                                        padding: '0 5px',
                                                        height: 44,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                    },
                                                    "& .MuiInputBase-input": {
                                                        fontWeight: 600,
                                                        fontSize: "16px",
                                                        padding: '0 !important',
                                                        marginRight: '0px',
                                                        "&::placeholder": {
                                                            color: "#000",
                                                            opacity: 1,
                                                            fontWeight: 500,
                                                            fontSize: "16px",
                                                        },
                                                    },
                                                    "& .MuiOutlinedInput-notchedOutline": {
                                                        border: "none",
                                                    },
                                                    "& .MuiAutocomplete-endAdornment": {
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                    },
                                                }}
                                            />
                                        )}
                                        sx={{
                                            width: 135,
                                            "& .MuiAutocomplete-inputRoot": {
                                                display: 'flex',
                                                alignItems: 'center',
                                            },
                                        }}
                                    />

                                </Box>

                                <Typography variant="h6" py={1}>Locker</Typography>
                                <Box display="flex" flexDirection="column" gap={1}>

                                    <Box display="flex" flexDirection="row" gap={2}>
                                        <Typography fontWeight={500} sx={{ color: "#6C7086" }}>Count:</Typography>
                                        <Typography fontWeight={500}>{thirdPartyData?.totalItems || 0}</Typography>
                                    </Box>

                                    <Box display="flex" flexDirection="row" gap={2}>
                                        <Typography fontWeight={500} sx={{ color: "#6C7086" }}>Weight:</Typography>
                                        <Typography fontWeight={500}>{formatNumber({ value: thirdPartyData?.totalNetWt, currency: null })}g</Typography>
                                    </Box>

                                    <Box display="flex" flexDirection="row" gap={2}>
                                        <Typography fontWeight={500} sx={{ color: "#6C7086" }}>Amount:</Typography>
                                        <Typography fontWeight={500}>{formatNumber({ value: thirdPartyData?.totalCurrentValue, decimalPlaces: 0 })}</Typography>
                                    </Box>

                                </Box>
                            </Box>


                        </Grid>
                    </Grid>
                </Box>



                <DataTable
                    actionType={ITEM_TABLE}
                    endpoint={API_ENDPOINTS.SP.POST}
                    table_type="reports-itemWise"
                    tableName="itemDetail"
                    isPopulated={false}
                    populateFields={["accountId", "itemId", "purityId", "metalId"]}
                    aggregateFields={{
                        fromCollection: "loanaccounts",
                        localField: "accountId",
                        foreignField: "_id",
                        filters: {
                            "loanStatus": 0
                        },
                        groupByField: ""
                    }}
                    exportOptions={true}
                />


            </DashboardContent>
        </>
    )
}

export default ItemWiseReports


export const ItemWiseFilter: React.FC<ItemWiseFilterProps> = ({ onFilterChange }) => {
    const [metals, setMetals] = useState<{ metalName: string; _id: string }[]>([]);
    const [purity, setPurity] = useState<{ purityName: string; _id: string }[]>([]);
    const [item, setItem] = useState<{ itemName: string; _id: string }[]>([]);
    const [branch, setBranch] = useState<{ branchName: string; _id: string }[]>([]);
  
    const { metalList, purityList, branchList, itemList } = useSelector((state: any) => ({
      metalList: state[METAL_LIST]?.data,
      purityList: state[PURITY_LIST]?.data,
      branchList: state[BRANCH_LIST]?.data,
      itemList: state[ITEM_LIST]?.data,
    }));
  
    const dispatch = useDispatch();
  
    useEffect(() => {
      if (metalList?.success) setMetals(metalList.data.data);
      if (purityList?.success) setPurity(purityList.data.data);
      if (itemList?.success) setItem(itemList.data.data);
      if (branchList?.success) setBranch(branchList.data.data);
    }, [metalList, purityList, itemList, branchList]);
  
    useEffect(() => {
      dispatch(
        apiRequest(METAL_LIST, "post", API_ENDPOINTS.SP.POST, {
          procedureName: "findAll",
          params: { tableName: "metal" },
        })
      );
      dispatch(
        apiRequest(ITEM_LIST, "post", API_ENDPOINTS.SP.POST, {
          procedureName: "findAll",
          params: { tableName: "items" },
        })
      );
      dispatch(
        apiRequest(PURITY_LIST, "post", API_ENDPOINTS.SP.POST, {
          procedureName: "findAll",
          params: { tableName: "purity" },
        })
      );
      dispatch(
        apiRequest(BRANCH_LIST, "post", API_ENDPOINTS.SP.POST, {
          procedureName: "findAll",
          params: { tableName: "branch" },
        })
      );
    }, [dispatch]);
  
    const getOptionsForField = (fieldName: string) => {
      switch (fieldName) {
        case "metals":
        case "metalId":
          return metals.map((m) => ({ label: m.metalName, value: m._id }));
        case "branchId":
          return branch.map((b) => ({ label: b.branchName, value: b._id }));
        case "purity":
        case "purityId":
          return purity.map((p) => ({ label: p.purityName, value: p._id }));
        case "item":
        case "itemId":
          return item.map((i) => ({ label: i.itemName, value: i._id }));
        default:
          return [];
      }
    };
  
    
    const [formValues, setFormValues] = useState<{ [key: string]: any }>({});
  
    const getCurrentValue = (fieldName: string) => {
      const value = formValues[fieldName];
      if (value === null || value === undefined || value === "") return null;
      const options = getOptionsForField(fieldName);
      return options.find((opt) => opt.value === value) || null;
    };
  
    const handleDropdownChange = (fieldName: string, selectedOption: any) => {
      const value = selectedOption?.value || "";
   
      setFormValues((prev) => ({ ...prev, [fieldName]: value }));
      
      onFilterChange(fieldName, value);
    };
  
    const itemWiseFields:ValidationField[] = [
      { name: "branchId", label: "Branch", placeHolder: "Select Branch" },
      { name: "metalId", label: "Select Metal", placeHolder: "Select Metal" },
      { name: "purityId", label: "Select Purity", placeHolder: "Select Purity" },
      { name: "itemId", label: "Select Item", placeHolder: "Select Item" },
    ];
  
    return (
      <Grid container spacing={2}>
        {itemWiseFields.map((field) => (
          <Grid item xs={12} sm={6} md={3} key={field.name}>
            <Autocomplete
              options={getOptionsForField(field.name)}
              getOptionLabel={(option) => option.label}
              value={getCurrentValue(field.name)}
              onChange={(_, value) => handleDropdownChange(field.name, value)}
              renderInput={(params) => (
                <TextField {...params} placeholder={field.placeHolder} variant="outlined" />
              )}
            />
          </Grid>
        ))}
      </Grid>
    );
  };