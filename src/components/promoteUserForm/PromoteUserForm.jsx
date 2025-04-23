import { useState, useEffect } from "react";
import { Box, Button, Alert, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import FloatingLabelSelect from "../layout/CustomFloatingSelect.jsx";
import { getAccessToken } from "../../utils/helpers/getAccessToken.js";
import { handleApiError } from "../../utils/helpers/handleApiError.js";
import { getAllUsersApi, promoteUserApi } from "../../services/apiService.js";

const PromoteUserForm = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [role, setRole] = useState("ADMIN");
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

    const handlePromote = async () => {
        try {
            const token = getAccessToken();
            await promoteUserApi({ email: selectedUser.value, roles: [role] }, token);
            setSuccess(`User ${selectedUser.label} promoted to ${role}.`);
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
                options={users.map(u => ({ value: u.email, label: u.email }))}
                value={selectedUser}
                onChange={(val) => setSelectedUser(val)}
            />

            <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel id="role-label">Select Role</InputLabel>
                <Select
                    labelId="role-label"
                    value={role}
                    label="Select Role"
                    onChange={(e) => setRole(e.target.value)}
                >
                    <MenuItem value="USER">USER</MenuItem>
                    <MenuItem value="CHEF">CHEF</MenuItem>
                    <MenuItem value="ADMIN">ADMIN</MenuItem>
                </Select>
            </FormControl>

            <Button
                variant="contained"
                onClick={handlePromote}
                disabled={!selectedUser}
                sx={{
                    mt: 2,
                    fontSize: "0.8rem",
                    color: "text.light",
                    fontWeight: "bold",
                    marginBottom: "20px",
                }}
            >
                Promote User
            </Button>

            {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
        </Box>
    );
};

export default PromoteUserForm;
