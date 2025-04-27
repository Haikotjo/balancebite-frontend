import PropTypes from "prop-types";
import { renderTextField } from "../renderTextField.jsx";
import { genderOptions, activityLevelOptions, goalOptions } from "../dropdownOptions.js";

/**
 * Renders all user details input fields using custom components.
 *
 * @param {object} props
 * @param {object} props.watchedFields - Watched form fields.
 * @param {function} props.register - react-hook-form register function.
 * @param {object} props.errors - Validation errors.
 * @param {boolean} props.isEditable - Whether fields are editable.
 * @returns {JSX.Element} Rendered user detail fields.
 */
const UserDetailsFields = ({ watchedFields, register, errors, isEditable }) => {
    return (
        <>
            {renderTextField("Height (cm)", "height", watchedFields, register, errors, isEditable, "number")}
            {renderTextField("Weight (kg)", "weight", watchedFields, register, errors, isEditable, "number")}
            {renderTextField("Age", "age", watchedFields, register, errors, isEditable, "number")}
            {renderTextField("Activity Level", "activityLevel", watchedFields, register, errors, isEditable, "text", true, activityLevelOptions)}
            {renderTextField("Goal", "goal", watchedFields, register, errors, isEditable, "text", true, goalOptions)}
            {renderTextField("Gender", "gender", watchedFields, register, errors, isEditable, "text", true, genderOptions)}
        </>
    );
};

UserDetailsFields.propTypes = {
    watchedFields: PropTypes.object.isRequired,
    register: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    isEditable: PropTypes.bool.isRequired,
};

export default UserDetailsFields;
