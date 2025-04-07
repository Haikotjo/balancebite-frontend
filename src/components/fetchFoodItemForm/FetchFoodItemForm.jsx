import { Box, Button, Typography, TextField, Alert, CircularProgress } from "@mui/material";
import { useState, useRef } from "react";
import { fetchFoodItemByFdcIdApi } from "../../services/apiService";
import { handleApiError } from "../../utils/helpers/handleApiError";

const FetchFoodItemForm = () => {
    const [fdcId, setFdcId] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const isSubmittingRef = useRef(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading || isSubmittingRef.current) return;
        isSubmittingRef.current = true;
        setSuccessMessage("");
        setLoading(true);
        console.log("Submit triggered");

        try {
            const result = await fetchFoodItemByFdcIdApi(fdcId);
            setSuccessMessage(result.message);
            setFdcId("");
        } catch (error) {
            handleApiError(error);
        } finally {
            setLoading(false);
            isSubmittingRef.current = false;
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}
        >
            <Typography variant="h5">Fetch Food Item by FDC ID</Typography>
            <TextField
                label="FDC ID"
                value={fdcId}
                onChange={(e) => setFdcId(e.target.value)}
                fullWidth
            />
            <Button variant="contained" type="submit" disabled={loading}  sx={{ color: "text.light" }}>
                {loading ? <CircularProgress size={24} color="inherit" /> : "Fetch and Save"}
            </Button>
            {successMessage && <Alert severity="success">{successMessage}</Alert>}
        </Box>
    );
};

export default FetchFoodItemForm;
