import { Navigate } from "react-router-dom";
import { userHasRole } from "../utils/helpers/authUtils";
import PropTypes from "prop-types";

const RequireAdminOrSupermarket = ({ children }) => {
    return userHasRole("ADMIN") || userHasRole("SUPERMARKET")
        ? children
        : <Navigate to="/" />;
};

RequireAdminOrSupermarket.propTypes = {
    children: PropTypes.node.isRequired,
};

export default RequireAdminOrSupermarket;