import React, { useContext, useState, useEffect } from "react";
import { Box, TextField, Typography, MenuItem } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { userDetailsSchema } from "../../../utils/valadition/userDetailsSchema.js";
import UserButton from "../userButton/UserButton";
import { AuthContext } from "../../../context/AuthContext";
import { jwtDecode } from "jwt-decode";

const UserDetailsForm = ({ onSubmit }) => {
    const { token } = useContext(AuthContext);
    const [isEditable, setIsEditable] = useState(false);
    const [userProfile, setUserProfile] = useState(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(userDetailsSchema),
        mode: "onBlur",
    });

    useEffect(() => {
        if (token) {
            try {
                console.log("Token gevonden:", token);
                const decodedToken = jwtDecode(token);
                console.log("Gedecodeerd token:", decodedToken);

                const userId = decodedToken?.sub;
                console.log("Opgehaalde user ID:", userId);

                if (userId) {
                    const fetchUserProfile = async () => {
                        try {
                            console.log("User ID geldig, starten met ophalen profiel...");
                            const response = await fetch(`http://localhost:8080/users/profile`, {
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${token}`,
                                },
                            });

                            if (response.ok) {
                                const data = await response.json();
                                console.log("Fetched user profile:", data);

                                setUserProfile({
                                    gender: data.gender || "MALE",
                                    activityLevel: data.activityLevel || "SEDENTARY",
                                    goal: data.goal || "MAINTENANCE",
                                    height: data.height || 170,
                                    weight: data.weight || 70,
                                    age: data.age || 30,
                                });
                                reset({
                                    gender: data.gender || "MALE",
                                    activityLevel: data.activityLevel || "SEDENTARY",
                                    goal: data.goal || "MAINTENANCE",
                                    height: data.height || 170,
                                    weight: data.weight || 70,
                                    age: data.age || 30,
                                });
                            } else {
                                console.error("Failed to fetch user profile. Status:", response.status);
                            }
                        } catch (error) {
                            console.error("Error fetching user profile:", error);
                        }
                    };

                    fetchUserProfile();
                } else {
                    console.warn("User ID (sub) is missing from the token.");
                }
            } catch (error) {
                console.error("Error decoding token:", error.message);
            }
        } else {
            console.warn("Geen token gevonden.");
        }
    }, [token, reset]);

    const handleCancel = () => {
        if (userProfile) {
            reset(userProfile); // Reset de velden naar de waarden die uit de API zijn geladen
        }
        setIsEditable(false); // Schakel de bewerkbare modus uit
    };

    const handleConfirm = async (data) => {
        try {
            console.log("Sending data to backend:", data);
            setUserProfile(data); // Update de lokale state
            setIsEditable(false); // Schakel de bewerkbare modus uit
        } catch (error) {
            console.error("Error updating user details:", error);
        }
    };

    const handleEdit = () => {
        setIsEditable(true);
    };

    if (!userProfile) {
        return <Typography>Loading...</Typography>; // Toon een laadindicator als de API nog bezig is
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
            <Typography variant="h4" align="left">
                Body Metrics
            </Typography>

            {/* Gender */}
            <TextField
                select
                label="Gender"
                defaultValue={userProfile.gender}
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
                defaultValue={userProfile.activityLevel}
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
                defaultValue={userProfile.goal}
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
