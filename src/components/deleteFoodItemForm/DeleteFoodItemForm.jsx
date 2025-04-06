import FloatingLabelSelectIngredient from "../floatingLabelSelect/FloatingLabelSelectIngredient.jsx";
import {Alert, Button} from "@mui/material";
import {handleApiError} from "../../utils/helpers/handleApiError.js";
import {getAccessToken} from "../../utils/helpers/getAccessToken.js";
import useFoodItems from "../../hooks/useFoodItems.js";
import {useState} from "react";
import {deleteFoodItemApi} from "../../services/apiService.js";
import { Box } from "@mui/material";

const DeleteFoodItemForm = () => {
    const { options, refetch } = useFoodItems();
    const [selectedItem, setSelectedItem] = useState(null);
    const [success, setSuccess] = useState("");


    const handleDelete = async () => {
        try {
            if (!selectedItem) return;
            const token = getAccessToken();
            await deleteFoodItemApi(selectedItem.value, token);
            setSuccess(`Food item with ID ${selectedItem.value} deleted.`);
            setSelectedItem(null);
            await refetch();
        } catch (error) {
            handleApiError(error);
        }
    };

    return (
        <Box>
            <FloatingLabelSelectIngredient
                label="Select Food Item to Delete"
                isMulti={false}
                options={options.map(item => ({
                    value: item.id.toString(),
                    label: item.name,
                }))}
                value={selectedItem}
                onChange={(selected) => setSelectedItem(selected)}
            />

            <Button
                variant="contained"
                color="error"
                disabled={!selectedItem}
                onClick={handleDelete}
                sx={{ mt: 2 }}
            >
                Delete Food Item
            </Button>

            {success && <Alert severity="success">{success}</Alert>}
        </Box>
    );
};

export default DeleteFoodItemForm;
