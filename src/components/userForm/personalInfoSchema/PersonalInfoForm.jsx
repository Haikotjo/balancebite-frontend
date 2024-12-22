import React, { useContext, useState, useEffect } from "react";
import {Box, CircularProgress, TextField, Typography} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { personalInfoSchema } from "../../../utils/valadition/personalInfoSchema.js";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../../../context/AuthContext";
import UserButton from "../userButton/UserButton.jsx"; // Import the reusable UserButton component

const PersonalInfoForm = ({ onSubmit }) => {
    const { token } = useContext(AuthContext);
    const [isEditable, setIsEditable] = useState(false);
    const [initialValues, setInitialValues] = useState(null);

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
        defaultValues: initialValues || {},
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
        // Zorg dat de payload correct is opgebouwd en trim de e-mail
        const payload = {
            userName: data.username.trim(),
            email: data.email.trim(), // Trim de e-mail
        };

        try {
            const response = await fetch("http://localhost:8080/users/basic-info", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const result = await response.json();
                setInitialValues(result);
                if (result.userName !== payload.userName) {
                    console.warn(
                        "Mismatch detected: userName in response does not match the sent payload."
                    );
                }
            } else {
                console.error(
                    `Failed to update user information. Status: ${response.status}`
                );
            }
        } catch (error) {
            console.error("Error updating user information:", error);
        }
        setIsEditable(false);
    };


    const handleEdit = () => {
        setIsEditable(true);
    };

    if (!initialValues) {
        return <CircularProgress />
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

            <Typography variant="h5" align="left">
                Info for {initialValues?.username}
            </Typography>

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
                InputLabelProps={{
                    shrink: true, // Dwing het label om altijd geshrinkt te blijven
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
                InputLabelProps={{
                    shrink: true,
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
