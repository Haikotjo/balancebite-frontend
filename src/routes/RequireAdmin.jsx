import { Navigate } from "react-router-dom";
import { userHasRole } from "../utils/helpers/authUtils";
import PropTypes from "prop-types";

const RequireAdmin = ({ children }) => {
    return userHasRole("ADMIN") ? children : <Navigate to="/" />;
};

RequireAdmin.propTypes = {
    children: PropTypes.node.isRequired,
};

export default RequireAdmin;
