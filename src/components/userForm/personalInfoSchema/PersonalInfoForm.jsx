import React, { useContext, useState, useEffect } from "react";
import { Box, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { personalInfoSchema } from "../../../utils/valadition/personalInfoSchema.js";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../../../context/AuthContext";
import UserButton from "../userButton/UserButton.jsx"; // Import the reusable UserButton component

const PersonalInfoForm = ({ onSubmit }) => {
    const { token } = useContext(AuthContext);
    const [isEditable, setIsEditable] = useState(false);
    const [initialValues, setInitialValues] = useState(null); // Start with null to indicate loading

    useEffect(() => {
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setInitialValues({
                    username: decodedToken.username || "Default Username",
                    email: decodedToken.email || "default@example.com",
                });
            } catch (error) {
                console.error("Invalid token:", error.message);
            }
        }
    }, [token]);

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(personalInfoSchema),
        defaultValues: initialValues || {}, // Use empty defaults until initialValues are set
        mode: "onBlur",
    });

    useEffect(() => {
        if (initialValues) {
            reset(initialValues);
        }
    }, [initialValues, reset]);

    const handleCancel = () => {
        reset(initialValues); // Reset fields to original values
        setIsEditable(false); // Disable editing
    };

    const handleConfirm = async (data) => {
        try {
            // Simulate a backend call
            console.log("Sending data to backend:", data);

            // Update initial values on success
            setInitialValues(data);
            reset(data); // Reset the form with new values

            // Exit editable mode
            setIsEditable(false);
        } catch (error) {
            console.error("Error updating user information:", error);
        }
    };

    const handleEdit = () => {
        setIsEditable(true);
    };

    if (!initialValues) {
        // Show a loading state if initialValues are not yet available
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box
            sx={{
                maxWidth: 600,
                margin: "auto",
                padding: 2,
                display: "flex",
                flexDirection: "column",
                gap: 2,
            }}
            component="form"
            onSubmit={handleSubmit(handleConfirm)}
        >

            {/* Username */}
            <TextField
                label="Username"
                {...register("username")}
                error={!!errors.username}
                helperText={errors.username?.message}
                fullWidth
                InputProps={{
                    readOnly: !isEditable,
                }}
                sx={{
                    backgroundColor: !isEditable ? "#f5f5f5" : "white",
                }}
            />

            {/* Email */}
            <TextField
                label="Email"
                type="email"
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
                fullWidth
                InputProps={{
                    readOnly: !isEditable,
                }}
                sx={{
                    backgroundColor: !isEditable ? "#f5f5f5" : "white",
                }}
            />

            <UserButton
                isEditable={isEditable}
                onEdit={handleEdit}
                onCancel={handleCancel}
                onConfirm={handleSubmit(handleConfirm)}
            />
        </Box>
    );
};

export default PersonalInfoForm;
