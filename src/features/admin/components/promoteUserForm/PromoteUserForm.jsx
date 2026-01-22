import { useState, useEffect } from "react";
import CustomFloatingSelect from "../../../../components/layout/CustomFloatingSelect.jsx";
import { getAccessToken } from "../../../../utils/helpers/getAccessToken.js";
import { handleApiError } from "../../../../utils/helpers/handleApiError.js";
import { getAllUsersApi, promoteUserApi, getMappedFoodSources } from "../../../../services/apiService.js";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomButton from "../../../../components/layout/CustomButton.jsx";
import ErrorDialog from "../../../../components/layout/ErrorDialog.jsx";

/**
 * PromoteUserForm component for managing user roles and supermarket sources.
 */
const PromoteUserForm = () => {
    const [users, setUsers] = useState([]);
    const [rawUsers, setRawUsers] = useState([]);
    const [foodSourceOptions, setFoodSourceOptions] = useState([]);

    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedRole, setSelectedRole] = useState(null);
    const [selectedFoodSource, setSelectedFoodSource] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    const roleOptions = [
        { value: "USER", label: "USER" },
        { value: "CHEF", label: "CHEF" },
        { value: "ADMIN", label: "ADMIN" },
        { value: "RESTAURANT", label: "RESTAURANT" },
        { value: "DIETITIAN", label: "DIETITIAN" },
        { value: "SUPERMARKET", label: "SUPERMARKET" }
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = getAccessToken();
                const [usersResponse, sourcesResponse] = await Promise.all([
                    getAllUsersApi(token),
                    getMappedFoodSources()
                ]);

                const userData = usersResponse.data || [];
                setRawUsers(userData);
                setUsers(userData.map(u => ({ value: u.email, label: u.email })));
                setFoodSourceOptions(sourcesResponse || []);
            } catch (error) {
                handleApiError(error);
            }
        };
        fetchData();
    }, []);

    /**
     * Auto-populates role and food source when a user email is selected.
     * Maps API data (roleName) to dropdown values.
     */
    const handleUserChange = (userOption) => {
        setSelectedUser(userOption);

        if (!userOption) {
            setSelectedRole(null);
            setSelectedFoodSource(null);
            return;
        }

        const userData = rawUsers.find(u => u.email === userOption.value);

        if (userData) {
            const roles = userData.roles || [];
            let currentRoleName = null;

            if (roles.length > 0) {
                // FIXED: Changed from rolename to roleName based on your API log
                currentRoleName = typeof roles[0] === 'object' ? roles[0].roleName : roles[0];
            }

            if (currentRoleName) {
                const matchingRole = roleOptions.find(opt => opt.value === currentRoleName.toUpperCase());
                setSelectedRole(matchingRole || null);
            } else {
                setSelectedRole(null);
            }

            // Populate food source if it exists in the user object
            if (userData.foodSource) {
                const matchingSource = foodSourceOptions.find(opt => opt.value === userData.foodSource);
                setSelectedFoodSource(matchingSource || null);
            } else {
                setSelectedFoodSource(null);
            }
        }
    };

    /**
     * Sends the updated role and food source to the server.
     */
    const handlePromote = async () => {
        if (!selectedUser || !selectedRole) return;

        if (selectedRole.value === "SUPERMARKET" && !selectedFoodSource) {
            return;
        }

        try {
            const token = getAccessToken();
            const payload = {
                email: selectedUser.value,
                roles: [selectedRole.value],
                foodSource: selectedRole.value === "SUPERMARKET" ? selectedFoodSource.value : null
            };

            await promoteUserApi(payload, token);
            setSuccessMessage(`Successfully updated ${selectedUser.label} to ${selectedRole.label}.`);

            setSelectedUser(null);
            setSelectedRole(null);
            setSelectedFoodSource(null);
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
                onChange={handleUserChange}
            />

            <CustomFloatingSelect
                label="Select Role"
                options={roleOptions}
                value={selectedRole}
                onChange={(val) => {
                    setSelectedRole(val);
                    if (val?.value !== "SUPERMARKET") setSelectedFoodSource(null);
                }}
            />

            {selectedRole?.value === "SUPERMARKET" && (
                <CustomFloatingSelect
                    label="Select Supermarket Source"
                    options={foodSourceOptions}
                    value={selectedFoodSource}
                    onChange={setSelectedFoodSource}
                    placeholder="Select predefined food source"
                />
            )}

            <CustomButton
                type="button"
                onClick={handlePromote}
                disabled={
                    !selectedUser ||
                    !selectedRole ||
                    (selectedRole.value === "SUPERMARKET" && !selectedFoodSource)
                }
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