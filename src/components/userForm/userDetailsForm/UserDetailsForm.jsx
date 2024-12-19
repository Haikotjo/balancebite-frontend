import {
    Box,
    TextField,
    Button,
    Typography,
    MenuItem,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { userDetailsSchema } from "../../../utils/valadition/userDetailsSchema.js";

const UserDetailsForm = ({ onSubmit }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(userDetailsSchema),
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
                Update User Details
            </Typography>

            {/* Gender */}
            <TextField
                select
                label="Gender"
                {...register("gender")}
                error={!!errors.gender}
                helperText={errors.gender?.message}
                fullWidth
            >
                <MenuItem value="MALE">Male</MenuItem>
                <MenuItem value="FEMALE">Female</MenuItem>
                <MenuItem value="OTHER">Other</MenuItem>
            </TextField>

            {/* Activity Level */}
            <TextField
                select
                label="Activity Level"
                {...register("activityLevel")}
                error={!!errors.activityLevel}
                helperText={errors.activityLevel?.message}
                fullWidth
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
                {...register("goal")}
                error={!!errors.goal}
                helperText={errors.goal?.message}
                fullWidth
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
            />

            {/* Weight */}
            <TextField
                label="Weight (kg)"
                type="number"
                {...register("weight")}
                error={!!errors.weight}
                helperText={errors.weight?.message}
                fullWidth
            />

            {/* Age */}
            <TextField
                label="Age"
                type="number"
                {...register("age")}
                error={!!errors.age}
                helperText={errors.age?.message}
                fullWidth
            />

            <Button type="submit" variant="contained" color="primary">
                Update Details
            </Button>
        </Box>
    );
};

export default UserDetailsForm;
