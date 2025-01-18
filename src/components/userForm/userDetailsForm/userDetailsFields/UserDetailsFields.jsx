import PropTypes from "prop-types";
import { renderTextField } from "../renderTextField.jsx";
import { genderOptions, activityLevelOptions, goalOptions } from "../dropdownOptions.js";

const UserDetailsFields = ({ watchedFields, register, errors, isEditable, theme }) => {
    return (
        <>
            {renderTextField("Gender", "gender", watchedFields, register, errors, isEditable, theme, "text", true, genderOptions)}

            {renderTextField("Activity Level", "activityLevel", watchedFields, register, errors, isEditable, theme, "text", true, activityLevelOptions)}

            {renderTextField("Goal", "goal", watchedFields, register, errors, isEditable, theme, "text", true, goalOptions)}

            {renderTextField("Height (cm)", "height", watchedFields, register, errors, isEditable, theme, "number")}

            {renderTextField("Weight (kg)", "weight", watchedFields, register, errors, isEditable, theme, "number")}

            {renderTextField("Age", "age", watchedFields, register, errors, isEditable, theme, "number")}
        </>
    );
};

UserDetailsFields.propTypes = {
    watchedFields: PropTypes.object.isRequired,
    register: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    isEditable: PropTypes.bool.isRequired,
    theme: PropTypes.object.isRequired,
};

export default UserDetailsFields;