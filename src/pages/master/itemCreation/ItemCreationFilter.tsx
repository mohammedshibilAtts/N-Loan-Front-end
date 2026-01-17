import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Autocomplete, TextField, Box, Stack } from "@mui/material";
import { METAL_LIST, PURITY_LIST } from "../../../store/actionTypes";
import API_ENDPOINTS from "../../../services/endpoints";
import { apiRequest } from "../../../store/actions";

interface FilterProps {
    onFilterChange: (fieldName: string, value: any) => void;
}

export const ItemCreationFilter: React.FC<FilterProps> = ({ onFilterChange }) => {
    const dispatch = useDispatch();
    const [metalId, setMetalId] = useState<string | null>(null);
    const [metals, setMetals] = useState<any[]>([]);
    const [purities, setPurities] = useState<any[]>([]);

    const { metalList, purityList } = useSelector((states: any) => ({
        metalList: states[METAL_LIST]?.data,
        purityList: states[PURITY_LIST]?.data,
    }));

    useEffect(() => {
        dispatch(apiRequest(METAL_LIST, "post", API_ENDPOINTS.SP.POST, {
            procedureName: "findAll",
            params: { tableName: "metal" },
        }));
    }, [dispatch]);

    useEffect(() => {
        if (metalList?.success) {
            setMetals(metalList.data.data || []);
        }
    }, [metalList]);

    useEffect(() => {
        if (metalId) {
            dispatch(apiRequest(PURITY_LIST, "post", API_ENDPOINTS.SP.POST, {
                procedureName: "find",
                params: {
                    tableName: "purity",
                    checkWith: ["purityName"],
                    filters: { metalId, active: true }
                },
                data: { metalId, active: true }
            }));
        } else {
            setPurities([]);
        }
    }, [metalId, dispatch]);

    useEffect(() => {
        if (purityList?.success) {
            setPurities(purityList.data.data || []);
        }
    }, [purityList]);

    return (
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <Box sx={{ width: 200 }}>
                <Autocomplete
                    options={metals}
                    getOptionLabel={(option) => option.metalName}
                    onChange={(_, value) => {
                        const val = value ? value._id : null;
                        setMetalId(val);
                        onFilterChange("metalId", val);
                        onFilterChange("purityId", null); // Reset purity when metal changes
                    }}
                    renderInput={(params) => (
                        <TextField {...params} label="Select Metal" size="small" />
                    )}
                />
            </Box>
            <Box sx={{ width: 200 }}>
                <Autocomplete
                    options={purities}
                    getOptionLabel={(option) => option.purityName}
                    disabled={!metalId}
                    key={metalId || "no-metal"} // Force re-render when metal changes
                    onChange={(_, value) => {
                        onFilterChange("purityId", value ? value._id : null);
                    }}
                    renderInput={(params) => (
                        <TextField {...params} label="Select Purity" size="small" />
                    )}
                />
            </Box>
        </Stack>
    );
};
