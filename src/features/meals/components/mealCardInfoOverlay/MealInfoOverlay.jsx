import PropTypes from "prop-types";
import { Users, UserPen } from "lucide-react";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import {useLocation, useNavigate} from "react-router-dom";
import {UserMealsContext} from "../../../../context/UserMealsContext.jsx";
import {useContext} from "react";
import {ModalContext} from "../../../../context/ModalContext.jsx";

/**
 * Displays metadata below the meal image, including creator and user count.
 * Fully styled using CustomBox and CustomTypography for easier migration to React Native.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.meal - Meal data with user and version info.
 * @returns {JSX.Element}
 */
const MealInfoOverlay = ({ meal, onNameClick }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { setFilters, setPage } = useContext(UserMealsContext);
    const { closeModal } = useContext(ModalContext);

    const handleClick = () => {
        if (!meal?.createdBy?.id) return;

        const filters = {
            creatorId: meal.createdBy.id,
            creatorUserName: meal.createdBy.userName,
        };

        if (location.pathname !== "/meals") {
            navigate(`/meals`, { state: { filtersFromRedirect: filters } });
        } else {
            setFilters(filters);
            setPage(1);
        }

        closeModal?.();

        if (onNameClick) {
            onNameClick();
        }
    };

    return (
        <CustomBox className="absolute bottom-0 left-0 w-full flex justify-between bg-[rgba(0,0,0,0.5)] text-white px-[10px] py-[5px]">
            <CustomTypography
                as="span"
                className="flex items-center gap-2 cursor-pointer hover:underline"
                onClick={handleClick}
            >
                <CustomTypography as="span" variant="xsmallCard" className="text-white">
                {meal.createdBy?.userName}
                </CustomTypography>
                <UserPen size={14} className="text-white"/>
            </CustomTypography>

            {meal.isTemplate && (
                <CustomTypography
                    as="span"
                    variant="xsmallCard"
                    className="flex items-center gap-1 text-white"
                >
                    <Users size={14} />
                    {meal.saveCount}
                </CustomTypography>
            )}
        </CustomBox>
    );
};

MealInfoOverlay.propTypes = {
    meal: PropTypes.shape({
        createdBy: PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            userName: PropTypes.string,
        }),
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        userCount: PropTypes.number,
        isTemplate: PropTypes.bool,
        saveCount: PropTypes.number,
    }).isRequired,
    fontSize: PropTypes.string,
    onNameClick: PropTypes.func,
};

export default MealInfoOverlay;
