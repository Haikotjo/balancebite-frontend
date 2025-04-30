import { useState, useEffect } from "react";
import CustomFloatingSelect from "../layout/CustomFloatingSelect.jsx";
import { getAccessToken } from "../../utils/helpers/getAccessToken.js";
import { handleApiError } from "../../utils/helpers/handleApiError.js";
import { getAllUsersApi, promoteUserApi } from "../../services/apiService.js";
import CustomBox from "../layout/CustomBox.jsx";
import CustomButton from "../layout/CustomButton.jsx";
import ErrorDialog from "../layout/ErrorDialog.jsx";

const PromoteUserForm = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedRole, setSelectedRole] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = getAccessToken();
                const response = await getAllUsersApi(token);
                setUsers(response.data.map(u => ({ value: u.email, label: u.email })));
            } catch (error) {
                handleApiError(error);
            }
        };
        fetchUsers();
    }, []);

    const roleOptions = [
        { value: "USER", label: "USER" },
        { value: "CHEF", label: "CHEF" },
        { value: "ADMIN", label: "ADMIN" }
    ];

    const handlePromote = async () => {
        if (!selectedUser || !selectedRole) return;
        try {
            const token = getAccessToken();
            await promoteUserApi({ email: selectedUser.value, roles: [selectedRole.value] }, token);
            setSuccessMessage(`User ${selectedUser.label} promoted to ${selectedRole.label}.`);
            setSelectedUser(null);
            setSelectedRole(null);
        } catch (error) {
            handleApiError(error);
        }
    };

    return (
        <CustomBox className="w-full mx-auto p-2 flex flex-col gap-4 mt-4 mb-12 sm:mb-4 scroll-smooth">
            <CustomFloatingSelect
                label="Select User by Email"
                options={users}
                value={selectedUser}
                onChange={setSelectedUser}
            />

            <CustomFloatingSelect
                label="Select New Role"
                options={roleOptions}
                value={selectedRole}
                onChange={setSelectedRole}
            />

            <CustomButton
                type="button"
                onClick={handlePromote}
                disabled={!selectedUser || !selectedRole}
                className="text-sm px-4 py-2 text-white bg-primary rounded-md hover:bg-primary/90 mt-2"
            >
                Promote User
            </CustomButton>

            <ErrorDialog
                open={!!successMessage}
                onClose={() => setSuccessMessage("")}
                message={successMessage}
                type="success"
            />
        </CustomBox>
    );
};

export default PromoteUserForm;
