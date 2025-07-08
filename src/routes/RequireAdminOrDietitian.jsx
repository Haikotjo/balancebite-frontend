// RequireAdminOrDietitian.jsx
import { Navigate } from "react-router-dom";
import { userHasRole } from "../utils/helpers/authUtils";
import PropTypes from "prop-types";

const RequireAdminOrDietitian = ({ children }) => {
    return userHasRole("ADMIN") || userHasRole("DIETITIAN")
        ? children
        : <Navigate to="/" />;
};

RequireAdminOrDietitian.propTypes = {
    children: PropTypes.node.isRequired,
};

export default RequireAdminOrDietitian;
