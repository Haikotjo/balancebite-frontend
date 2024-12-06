import PropTypes from "prop-types";
import { Alert } from "@mui/material";

const ErrorAlert = ({ message }) => {
    if (!message) return null;

    return <Alert severity="error">{message}</Alert>;
};

ErrorAlert.propTypes = {
    message: PropTypes.string,
};

export default ErrorAlert;
