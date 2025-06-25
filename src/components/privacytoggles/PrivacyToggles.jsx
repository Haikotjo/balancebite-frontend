import {useContext, useEffect, useState} from "react";
import PropTypes from "prop-types";
import {updateDietPlanPrivacyApi, updateMealPrivacyApi} from "../../services/apiService.js";
import CustomCheckbox from "../layout/CustomCheckbox.jsx";
import {UserDietsContext} from "../../context/UserDietContext.jsx";
import CustomBox from "../layout/CustomBox.jsx";
import ErrorDialog from "../layout/ErrorDialog.jsx";


const PrivacyToggles = ({ mealId, dietPlanId, initialMealPrivate, initialDietPrivate }) => {
    const token = localStorage.getItem("accessToken");
    const { replaceDietInDiets, userDiets } = useContext(UserDietsContext);

    const [mealShared, setMealShared] = useState(() => !initialMealPrivate);

    const [dietShared, setDietShared] = useState(() => !initialDietPrivate);

    const [loading, setLoading] = useState(false);

    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleMealToggle = async () => {
        try {
            setLoading(true);
            const newShared = !mealShared;
            await updateMealPrivacyApi(mealId, !newShared, token);
            setMealShared(newShared);
        } catch (err) {
            console.error("❌ Failed to update meal privacy", err);
            const error = err?.response?.data;
            const msg = error?.diets?.length
                ? `${error.error}\nIn diets: ${error.diets.join(", ")}`
                : error?.error || "Failed to update privacy.";
            setErrorMessage(msg);
            setErrorDialogOpen(true);
        }
        finally {
            setLoading(false);
        }
    };

    const handleDietToggle = async () => {
        try {
            setLoading(true);
            const newShared = !dietShared;
            const newPrivateStatus = !newShared;
            console.log(`[Privacy] Updating diet plan (${dietPlanId}) privacy to`, newPrivateStatus);
            await updateDietPlanPrivacyApi(dietPlanId, newPrivateStatus, token);
            setDietShared(newShared);

            const existing = userDiets.find(d => d.id === dietPlanId);
            if (existing) {
                replaceDietInDiets(dietPlanId, { ...existing, private: newPrivateStatus });
            }
        } catch (err) {
            console.error("❌ Failed to update diet privacy", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setMealShared(!initialMealPrivate);
    }, [initialMealPrivate]);

    useEffect(() => {
        setDietShared(!initialDietPrivate);
    }, [initialDietPrivate]);



    return (
        <CustomBox className="space-y-4">
            {mealId && (
                <CustomCheckbox
                    checked={mealShared}
                    onChange={handleMealToggle}
                    label={mealShared ? "Public" : "Make Public"}
                    id="mealPrivacy"
                    disabled={loading}
                    className={mealShared ? "border-primary" : "border-[#DD1155]"}
                />
            )}

            {dietPlanId && (
                <CustomCheckbox
                    checked={dietShared}
                    onChange={handleDietToggle}
                    label={dietShared ? "Public" : "Make Public"}
                    id="dietPrivacy"
                    disabled={loading}
                    className={dietShared ? "border-primary" : "border-[#DD1155]"}
                />
            )}

            <ErrorDialog
                open={errorDialogOpen}
                onClose={() => setErrorDialogOpen(false)}
                message={errorMessage}
                type="error"
            />
        </CustomBox>
    );
};

PrivacyToggles.propTypes = {
    mealId: PropTypes.number,
    dietPlanId: PropTypes.number,
    initialMealPrivate: PropTypes.bool,
    initialDietPrivate: PropTypes.bool,
};


export default PrivacyToggles;
