import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Check, PencilLine } from "lucide-react"; // Added icons
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import CustomTextField from "../../../../components/layout/CustomTextField.jsx";
import CustomIconButton from "../../../../components/layout/CustomIconButton.jsx";

const InfoMetricTile = ({
                            icon: Icon,
                            label,
                            value,
                            className = "",
                            shouldCapitalize = true,
                            isEditable = false,
                            onSave = null,
                            isEditingExternally = false,
                            setIsEditingExternally = null
                        }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(value);
    const isFirstRender = useRef(true);

    useEffect(() => {
        setIsEditing(isEditingExternally);

        if (!isEditingExternally && !isFirstRender.current && isEditing) {
            const hasChanged = String(editValue) !== String(value);
            if (hasChanged && onSave) {
                onSave(editValue);
            }
        }
        isFirstRender.current = false;
    }, [isEditingExternally, isEditing, editValue, value, onSave]);

    useEffect(() => {
        setEditValue(value);
    }, [value]);

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            setIsEditingExternally?.(false);
        } else if (e.key === "Escape") {
            setEditValue(value);
            setIsEditingExternally?.(false);
        }
    };

    return (
        <CustomBox className={`relative flex items-center gap-3 p-3 rounded-lg border border-borderDark dark:border-borderLight shadow-sm transition-all ${isEditing ? "ring-2 ring-primary border-transparent" : ""} ${className}`}>

            <CustomIconButton
                icon={<Icon />}
                iconSize={20}
                size={38}
                bgColor={isEditable ? "bg-primary/10" : "bg-transparent"}
                className={isEditable ? "text-primary" : "text-gray-400"}
                onClick={() => isEditable && setIsEditingExternally?.(true)}
                disableScale={!isEditable}
                useMotion={isEditable}
            />

            <CustomBox className="flex flex-col min-w-0 w-full pr-8">
                <CustomTypography variant="bold" className="text-friendlyGray uppercase tracking-wider text-[10px] truncate">
                    {label}
                </CustomTypography>

                {isEditing ? (
                    <CustomTextField
                        name={label.replace(/\s+/g, '-').toLowerCase()}
                        type="number"
                        autoFocus
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
                            handleKeyDown(e);
                        }}
                        variant="outlined"
                        className="mt-0"
                        step="0.1"
                    />
                ) : (
                    <CustomTypography
                        bold
                        className={`text-gray-800 truncate ${shouldCapitalize ? "capitalize" : ""}`}
                    >
                        {value || "—"}
                    </CustomTypography>
                )}
            </CustomBox>

            {/* Internal Action Button */}
            {isEditable && (
                <div className="absolute top-2 right-2">
                    <CustomIconButton
                        icon={isEditing ? <Check /> : <PencilLine />}
                        iconSize={isEditing ? 18 : 14}
                        size={28}
                        bgColor="bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800"
                        className={isEditing ? "text-green-600" : "text-gray-400 hover:text-primary"}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsEditingExternally?.(!isEditingExternally);
                        }}
                    />
                </div>
            )}
        </CustomBox>
    );
};

InfoMetricTile.propTypes = {
    icon: PropTypes.elementType.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    className: PropTypes.string,
    shouldCapitalize: PropTypes.bool,
    isEditingExternally: PropTypes.bool,
    setIsEditingExternally: PropTypes.func,
    onSave: PropTypes.func,
    isEditable: PropTypes.bool
};

export default InfoMetricTile;