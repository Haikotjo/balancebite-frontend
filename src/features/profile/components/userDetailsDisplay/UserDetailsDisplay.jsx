import PropTypes from "prop-types";
import { Scale, Ruler, VenusAndMars, Activity, Calendar, PencilLine, Target, Check } from "lucide-react";
import CustomCard from "../../../../components/layout/CustomCard.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import CustomButton from "../../../../components/layout/CustomButton.jsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import Spinner from "../../../../components/layout/Spinner.jsx";
import InfoMetricTile from "../infoMetricTile/InfoMetricTile.jsx";

const UserDetailsDisplay = ({
                                data,
                                onEdit,
                                onQuickWeightUpdate,
                                onQuickTargetUpdate,
                                isLoading,
                                isEditingWeight,
                                isEditingTarget,
                                setIsEditingWeight,
                                setIsEditingTarget
                            }) => {
    const formatValue = (val, suffix = "") => val ? `${val}${suffix}` : "—";
    const formatActivity = (str) => str ? str.replace(/_/g, " ").toLowerCase() : "Not set";

    return (
        <CustomCard hasBorder className="p-6 flex flex-col gap-6 shadow-sm min-h-[250px]">
            <CustomBox className="flex justify-between items-center border-b pb-4">
                <CustomTypography variant="h2" className="flex items-center gap-2">
                    <Scale size={24} className="text-primary" />
                    Body Metrics
                </CustomTypography>
                {!isLoading && (
                    <CustomButton
                        onClick={onEdit}
                        variant="ghost"
                        className="text-primary p-2 rounded-full"
                        aria-label="Edit all metrics"
                    >
                        <PencilLine size={20} />
                    </CustomButton>
                )}
            </CustomBox>

            {isLoading ? (
                <CustomBox className="flex justify-center items-center py-12">
                    <Spinner />
                </CustomBox>
            ) : (
                <CustomBox className="flex flex-col gap-6">
                    <CustomBox className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InfoMetricTile icon={VenusAndMars} label="Gender" value={data?.gender} />
                        <InfoMetricTile icon={Calendar} label="Age" value={formatValue(data?.age, " years")} />
                        <InfoMetricTile icon={Ruler} label="Height" value={formatValue(data?.height, " cm")} />

                        {/* Weight */}
                        <div className="relative group">
                            <InfoMetricTile
                                icon={Scale}
                                label="Weight"
                                value={data?.weight}
                                isEditable={true}
                                isEditingExternally={isEditingWeight}
                                setIsEditingExternally={setIsEditingWeight}
                                onSave={onQuickWeightUpdate}
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    if (isEditingWeight) {
                                        setIsEditingWeight(false);
                                    } else {
                                        setIsEditingWeight(true);
                                    }
                                }}
                                className="absolute top-2 right-2 p-1 transition-colors z-10"
                                title={isEditingWeight ? "Save weight" : "Edit weight"}
                            >
                                {isEditingWeight ? (
                                    <Check size={18} className="text-green-600 font-bold" />
                                ) : (
                                    <PencilLine size={14} className="text-gray-400 hover:text-primary" />
                                )}
                            </button>
                        </div>

                        {/* Target Weight */}
                        <div className="relative group">
                            <InfoMetricTile
                                icon={Target}
                                label="Target Weight"
                                value={data?.targetWeight}
                                isEditable={true}
                                isEditingExternally={isEditingTarget}
                                setIsEditingExternally={setIsEditingTarget}
                                onSave={onQuickTargetUpdate}
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    if (isEditingTarget) {
                                        setIsEditingTarget(false);
                                    } else {
                                        setIsEditingTarget(true);
                                    }
                                }}
                                className="absolute top-2 right-2 p-1 transition-colors z-10"
                                title={isEditingTarget ? "Save target weight" : "Edit target weight"}
                            >
                                {isEditingTarget ? (
                                    <Check size={18} className="text-green-600 font-bold" />
                                ) : (
                                    <PencilLine size={14} className="text-gray-400 hover:text-primary" />
                                )}
                            </button>
                        </div>

                        <InfoMetricTile
                            className="sm:col-span-2"
                            icon={Activity}
                            label="Activity Level"
                            value={formatActivity(data?.activityLevel)}
                        />
                    </CustomBox>
                </CustomBox>
            )}
        </CustomCard>
    );
};

UserDetailsDisplay.propTypes = {
    data: PropTypes.shape({
        gender: PropTypes.string,
        age: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        weight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        targetWeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        activityLevel: PropTypes.string,
    }),
    onEdit: PropTypes.func.isRequired,
    onQuickWeightUpdate: PropTypes.func,
    onQuickTargetUpdate: PropTypes.func,
    isEditingWeight: PropTypes.bool,
    isEditingTarget: PropTypes.bool,
    setIsEditingWeight: PropTypes.func,
    setIsEditingTarget: PropTypes.func,
    isLoading: PropTypes.bool,
};

export default UserDetailsDisplay;