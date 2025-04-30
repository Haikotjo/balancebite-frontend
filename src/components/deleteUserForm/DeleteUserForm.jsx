import { useState, useEffect } from "react";
import CustomFloatingSelect from "../layout/CustomFloatingSelect.jsx";
import { getAccessToken } from "../../utils/helpers/getAccessToken.js";
import { handleApiError } from "../../utils/helpers/handleApiError.js";
import { getAllUsersApi, deleteUserApi } from "../../services/apiService.js";
import CustomBox from "../layout/CustomBox.jsx";
import CustomButton from "../layout/CustomButton.jsx";
import ErrorDialog from "../layout/ErrorDialog.jsx";

const DeleteUserForm = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = getAccessToken();
                const response = await getAllUsersApi(token);
                setUsers(response.data.map(u => ({
                    value: u.email,
                    label: u.email,
                    id: u.id,
                })));
            } catch (error) {
                handleApiError(error);
            }
        };
        fetchUsers();
    }, []);

    const handleDelete = async () => {
        try {
            if (!selectedUser) return;
            const token = getAccessToken();
            await deleteUserApi({ id: selectedUser.id }, token);
            setSuccessMessage(`User "${selectedUser.label}" deleted.`);
            setSelectedUser(null);
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

            <CustomButton
                type="button"
                onClick={handleDelete}
                disabled={!selectedUser}
                className="text-sm px-4 py-2 text-white bg-error rounded-md hover:bg-red-700 mt-2"
            >
                Delete User
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

export default DeleteUserForm;
