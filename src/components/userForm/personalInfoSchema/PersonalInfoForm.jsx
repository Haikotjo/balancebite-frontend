import {
    Box,
    TextField,
    Button,
    Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { personalInfoSchema } from "../../../utils/valadition/personalInfoForm.js";

const PersonalInfoForm = ({ onSubmit }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(personalInfoSchema),
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
