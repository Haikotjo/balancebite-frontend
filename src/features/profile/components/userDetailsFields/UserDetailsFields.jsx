import PropTypes from "prop-types";
import { renderTextField } from "../../utils/helpers/renderTextField.jsx";
import { genderOptions, activityLevelOptions, goalOptions } from "../../../../constants/dropdownOptions.js";

/**
 * Renders all user details input fields using custom components.
 *
 * @param {object} props
 * @param {object} props.watchedFields - Watched form fields.
 * @param {function} props.register - react-hook-form register function.
 * @param {function} props.setValue - react-hook-form setValue function.
 * @param {object} props.errors - Validation errors.
 * @param {boolean} props.isEditable - Whether fields are editable.
 * @returns {JSX.Element} Rendered user detail fields.
 */
const UserDetailsFields = ({ watchedFields, register, setValue, errors, isEditable }) => {
    return (
        <>
            {renderTextField("Height (cm)", "height", watchedFields, register, errors, isEditable, setValue, "number")}
            {renderTextField("Weight (kg)", "weight", watchedFields, register, errors, isEditable, setValue, "number")}
            {renderTextField("Target Weight (kg)", "targetWeight", watchedFields, register, errors, isEditable, setValue, "number")}
            {renderTextField("Age", "age", watchedFields, register, errors, isEditable, setValue, "number")}
            {renderTextField("Activity Level", "activityLevel", watchedFields, register, errors, isEditable, setValue, "text", true, activityLevelOptions)}
            {renderTextField("Goal", "goal", watchedFields, register, errors, isEditable, setValue, "text", true, goalOptions)}
            {renderTextField("Gender", "gender", watchedFields, register, errors, isEditable, setValue, "text", true, genderOptions)}
        </>
    );
};

UserDetailsFields.propTypes = {
    watchedFields: PropTypes.object.isRequired,
    register: PropTypes.func.isRequired,
    setValue: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    isEditable: PropTypes.bool.isRequired,
};

export default UserDetailsFields;
