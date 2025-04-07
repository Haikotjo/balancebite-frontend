import { useState, useEffect } from "react";
import { Box, Button, Alert } from "@mui/material";
import FloatingLabelSelect from "../floatingLabelSelect/FloatingLabelSelectIngredient.jsx";
import { getAccessToken } from "../../utils/helpers/getAccessToken.js";
import { handleApiError } from "../../utils/helpers/handleApiError.js";
import { getAllUsersApi, deleteUserApi } from "../../services/apiService.js";

const DeleteUserForm = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = getAccessToken();
                const response = await getAllUsersApi(token);
                setUsers(response.data);
            } catch (error) {
                handleApiError(error);
            }
        };
        fetchUsers();
    }, []);

    const handleDelete = async () => {
        try {
            const token = getAccessToken();
            await deleteUserApi({ id: selectedUser.id }, token);
            setSuccess(`User ${selectedUser.label} deleted.`);
            setSelectedUser(null);
        } catch (error) {
            handleApiError(error);
        }
    };

    return (
        <Box>
            <FloatingLabelSelect
                label="Select user by email"
                isMulti={false}
                options={users.map(u => ({
                    value: u.email,
                    label: u.email,
                    id: u.id
                }))}
                value={selectedUser}
                onChange={(val) => setSelectedUser(val)}
            />

            <Button
                variant="contained"
                color="error"
                onClick={handleDelete}
                disabled={!selectedUser}
                sx={{ mt: 2 }}
            >
                Delete User
            </Button>

            {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
        </Box>
    );
};

export default DeleteUserForm;
