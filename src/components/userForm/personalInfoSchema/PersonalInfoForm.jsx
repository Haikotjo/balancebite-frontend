import { useContext, useState, useEffect } from "react";
import { CircularProgress,useTheme } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { personalInfoSchema } from "../../../utils/valadition/personalInfoSchema.js";
import { AuthContext } from "../../../context/AuthContext";
import UserButton from "../userButton/UserButton.jsx";
import useUpdateUserInfo from "../../../hooks/useUpdateUserInfo.js";
import useUserInitialValues from "../../../hooks/useUserInitialValues.js";
import SnackbarComponent from "../../snackbarComponent/SnackbarComponent.jsx";
import UserInputField from "./userInputField/UserInputField.jsx";
import PersonalInfoBox from "./personalInfoBox/PersonalInfoBox.jsx";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";


const PersonalInfoForm = () => {
    const theme = useTheme();
    const { token } = useContext(AuthContext);
    const [isEditable, setIsEditable] = useState(false);
    const [initialValues, setInitialValues] = useUserInitialValues(token);

    const { updateUserInfo, updateError, updateSuccess, setUpdateError, setUpdateSuccess } = useUpdateUserInfo();

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
        reset(initialValues);
        setIsEditable(false);
    };

    const handleConfirm = async (data) => {
        await updateUserInfo(data, initialValues, setInitialValues, reset, setIsEditable);
    };

    const handleEdit = () => {
        setIsEditable(true);
    };

    if (!initialValues) {
        return <CircularProgress />;
    }

    return (
        <PersonalInfoBox onSubmit={handleSubmit(handleConfirm)}>
            <InfoRoundedIcon
                sx={{
                    color: theme.palette.mode === "dark" ? theme.palette.text.primary : theme.palette.primary.main,
                    fontSize: 32,
                }}
            />

            <UserInputField
                label="Username"
                register={register("username")}
                error={!!errors.username}
                helperText={errors.username?.message}
                isEditable={isEditable}
            />

            <UserInputField
                label="Email"
                type="email"
                register={register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
                isEditable={isEditable}
            />

            <UserButton
                isEditable={isEditable}
                onEdit={handleEdit}
                onCancel={handleCancel}
                onConfirm={handleSubmit(handleConfirm)}
            />

            <SnackbarComponent
                open={Boolean(updateError) || Boolean(updateSuccess)}
                onClose={() => {
                    setUpdateError("");
                    setUpdateSuccess("");
                }}
                message={updateError || updateSuccess}
                severity={updateError ? "error" : "success"}
            />

        </PersonalInfoBox>
    );
};

export default PersonalInfoForm;
