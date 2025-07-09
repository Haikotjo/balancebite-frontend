import { useState } from "react";
import PropTypes from "prop-types";
import CustomBox from "./CustomBox.jsx";
import CustomTypography from "./CustomTypography.jsx";
import { X } from "lucide-react";

const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim().toLowerCase());

const CustomEmailTagInput = ({
                                 value = [],
                                 onChange,
                                 label,
                                 placeholder = "Voer e-mail in en druk op Enter",
                                 error,
                             }) => {
    const [input, setInput] = useState("");

    const handleKeyDown = (e) => {
        if ((e.key === "Enter" || e.key === ",") && input.trim() !== "") {
            e.preventDefault();
            const email = input.trim().toLowerCase();
            if (isValidEmail(email) && !value.includes(email)) {
                onChange([...value, email]);
                setInput("");
            }
        }
    };

    const removeEmail = (emailToRemove) => {
        onChange(value.filter((email) => email !== emailToRemove));
    };

    return (
        <CustomBox className="w-full mt-4">
            <label className="block text-xs text-primary mb-1">{label}</label>

            <div
                className={`flex flex-wrap gap-2 border rounded p-2 bg-lightBackground dark:bg-darkBackground ${
                    error ? "border-error" : "border-primary"
                }`}
            >
                {value.map((email) => (
                    <div
                        key={email}
                        className="flex items-center bg-primary text-white rounded-full px-2 py-1 text-xs"
                    >
                        {email}
                        <button
                            type="button"
                            onClick={() => removeEmail(email)}
                            className="ml-1 text-white hover:text-gray-200"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="flex-1 bg-transparent text-sm focus:outline-none px-1 text-gray-900 dark:text-gray-100"
                />
            </div>

            {error && (
                <CustomTypography
                    variant="small"
                    color="text-error"
                    className="text-xs mt-1"
                >
                    Ongeldig of leeg e-mailadres.
                </CustomTypography>
            )}
        </CustomBox>
    );
};

CustomEmailTagInput.propTypes = {
    value: PropTypes.arrayOf(PropTypes.string).isRequired,
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    error: PropTypes.bool,
};

export default CustomEmailTagInput;
