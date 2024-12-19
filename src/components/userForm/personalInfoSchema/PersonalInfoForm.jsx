import React, { useContext } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { personalInfoSchema } from "../../../utils/valadition/personalInfoSchema.js";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../../../context/AuthContext"; // Importeer de context

const PersonalInfoForm = ({ onSubmit }) => {
    const { token } = useContext(AuthContext); // Haal token uit context
    let decodedToken = {};

    if (token) {
        try {
            decodedToken = jwtDecode(token);
        } catch (error) {
            console.error("Invalid token:", error.message);
        }
    } else {
        console.warn("Token is missing. Default values will be used.");
    }

    const initialValues = {
        username: decodedToken.username || "Default Username",
        email: decodedToken.email || "default@example.com",
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(personalInfoSchema),
        defaultValues: initialValues,
    });

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
            onSubmit={handleSubmit(onSubmit)}
        >
            <Typography variant="h4" align="left">
                Update Personal Info
            </Typography>

            {/* Username */}
            <TextField
                label="Username"
                {...register("username")}
                error={!!errors.username}
                helperText={errors.username?.message}
                fullWidth
            />

            {/* Email */}
            <TextField
                label="Email"
                type="email"
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
                fullWidth
            />

            <Button type="submit" variant="contained" color="primary">
                Update Info
            </Button>
        </Box>
    );
};

export default PersonalInfoForm;
