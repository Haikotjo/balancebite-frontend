import { Box, TextField, Button, Alert, Typography, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { createUserAsAdminApi } from "../../services/apiService";
import { getAccessToken } from "../../utils/helpers/getAccessToken";
import userRegistrationAdminSchema from "../../utils/helpers/userRegistrationAdminSchema.js";

const CreateUserFormForAdmin = () => {
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(userRegistrationAdminSchema),
        mode: "onBlur",
    });

    const handleCreateUser = async (data) => {
        console.log("Form submitted with data:", data); // ✅ Check of dit logt
        try {
            const token = getAccessToken();
            await createUserAsAdminApi(data, token);
            setSuccessMessage("User successfully created.");
            setErrorMessage("");
            reset();
        } catch (error) {
            console.error("Create user failed:", error);
            setErrorMessage("Failed to create user.");
            setSuccessMessage("");
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit(handleCreateUser)}
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                p: 3,
                border: "1px solid #ccc",
                borderRadius: 2,
                maxWidth: 400,
                mx: "auto",
            }}
        >
            <Typography variant="h6" align="center">Create New User</Typography>

            {successMessage && <Alert severity="success">{successMessage}</Alert>}
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

            <TextField
                label="Username"
                {...register("userName")}
                error={!!errors.userName}
                helperText={errors.userName?.message}
                required
            />

            <TextField
                label="Email"
                type="email"
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
                required
            />

            <TextField
                label="Password"
                type="password"
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
                required
            />


            <TextField
                label="Confirm Password"
                type="password"
                {...register("confirmPassword")}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                required
            />

            <Controller
                name="roles"
                control={control}
                defaultValue={["USER"]}
                render={({ field }) => (
                    <FormControl fullWidth error={!!errors.roles}>
                        <InputLabel>Role</InputLabel>
                        <Select
                            label="Role"
                            value={field.value[0]}
                            onChange={(e) => field.onChange([e.target.value])}
                        >
                            <MenuItem value="USER">USER</MenuItem>
                            <MenuItem value="ADMIN">ADMIN</MenuItem>
                            <MenuItem value="CHEF">CHEF</MenuItem>
                        </Select>
                    </FormControl>
                )}
            />

            <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{
                    mt: 2,
                    fontSize: "0.8rem",
                    color: "text.light",
                    fontWeight: "bold",
                    marginBottom: "20px",
                }}
                onClick={() => console.log("Button clicked")}
            >
                Create User
            </Button>

        </Box>
    );
};

export default CreateUserFormForAdmin;