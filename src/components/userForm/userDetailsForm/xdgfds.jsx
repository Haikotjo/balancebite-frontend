import React, { useState, useEffect } from "react";
import { Box, TextField, Typography, MenuItem } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { userDetailsSchema } from "../../../utils/valadition/userDetailsSchema.js";
import UserButton from "../userButton/UserButton"; // Import the reusable UserButton component

const UserDetailsForm = ({ onSubmit }) => {
    const [isEditable, setIsEditable] = useState(false);
    const [initialValues, setInitialValues] = useState({
        gender: "MALE",
        activityLevel: "SEDENTARY",
        goal: "MAINTENANCE",
        height: 170,
        weight: 70,
        age: 30,
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(userDetailsSchema),
        defaultValues: initialValues,
        mode: "onBlur",
    });

    useEffect(() => {
        reset(initialValues);
    }, [initialValues, reset]);

    const handleCancel = () => {
        reset(initialValues);
        setIsEditable(false);
    };

    const handleConfirm = async (data) => {
        try {
            // Simuleer een backend call
            console.log("Sending data to backend:", data);

            // Update initial values on success
            setInitialValues(data);
            reset(data);

            // Exit editable mode
            setIsEditable(false);
        } catch (error) {
            console.error("Error updating user details:", error);
        }
    };

    const handleEdit = () => {
        setIsEditable(true);
    };

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
            <Typography variant="h4" align="left">
                Body Metrics
            </Typography>

            {/* Gender */}
            <TextField
                select
                label="Gender"
                defaultValue="MALE"
                {...register("gender")}
                error={!!errors.gender}
                helperText={errors.gender?.message}
                fullWidth
                InputProps={{
                    readOnly: !isEditable,
                }}
                sx={{
                    backgroundColor: !isEditable ? "#f5f5f5" : "white",
                }}
            >
                <MenuItem value="MALE">Male</MenuItem>
                <MenuItem value="FEMALE">Female</MenuItem>
                <MenuItem value="OTHER">Other</MenuItem>
            </TextField>

            {/* Activity Level */}
            <TextField
                select
                label="Activity Level"
                defaultValue="MODERATE"
                {...register("activityLevel")}
                error={!!errors.activityLevel}
                helperText={errors.activityLevel?.message}
                fullWidth
                InputProps={{
                    readOnly: !isEditable,
                }}
                sx={{
                    backgroundColor: !isEditable ? "#f5f5f5" : "white",
                }}
            >
                <MenuItem value="SEDENTARY">Sedentary</MenuItem>
                <MenuItem value="LIGHT">Light</MenuItem>
                <MenuItem value="MODERATE">Moderate</MenuItem>
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="VERY_ACTIVE">Very Active</MenuItem>
            </TextField>

            {/* Goal */}
            <TextField
                select
                label="Goal"
                defaultValue="MAINTENANCE"
                {...register("goal")}
                error={!!errors.goal}
                helperText={errors.goal?.message}
                fullWidth
                InputProps={{
                    readOnly: !isEditable,
                }}
                sx={{
                    backgroundColor: !isEditable ? "#f5f5f5" : "white",
                }}
            >
                <MenuItem value="WEIGHT_LOSS">Weight Loss</MenuItem>
                <MenuItem value="WEIGHT_LOSS_WITH_MUSCLE_MAINTENANCE">Weight Loss with Muscle Maintenance</MenuItem>
                <MenuItem value="MAINTENANCE">Maintenance</MenuItem>
                <MenuItem value="MAINTENANCE_WITH_MUSCLE_FOCUS">Maintenance with Muscle Focus</MenuItem>
                <MenuItem value="WEIGHT_GAIN">Weight Gain</MenuItem>
                <MenuItem value="WEIGHT_GAIN_WITH_MUSCLE_FOCUS">Weight Gain with Muscle Focus</MenuItem>
            </TextField>

            {/* Height */}
            <TextField
                label="Height (cm)"
                type="number"
                {...register("height")}
                error={!!errors.height}
                helperText={errors.height?.message}
                fullWidth
                InputProps={{
                    readOnly: !isEditable,
                }}
                sx={{
                    backgroundColor: !isEditable ? "#f5f5f5" : "white",
                }}
            />

            {/* Weight */}
            <TextField
                label="Weight (kg)"
                type="number"
                {...register("weight")}
                error={!!errors.weight}
                helperText={errors.weight?.message}
                fullWidth
                InputProps={{
                    readOnly: !isEditable,
                }}
                sx={{
                    backgroundColor: !isEditable ? "#f5f5f5" : "white",
                }}
            />

            {/* Age */}
            <TextField
                label="Age"
                type="number"
                {...register("age")}
                error={!!errors.age}
                helperText={errors.age?.message}
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

export default UserDetailsForm;
