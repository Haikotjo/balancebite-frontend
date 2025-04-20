import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import { Soup, UserPen, BookOpen } from "lucide-react";
import { UserMealsContext } from "../../context/UserMealsContext.jsx";
import { useNavigate } from "react-router-dom";
import CustomBox from "../layout/CustomBox.jsx";
import CustomCardChip from "../layout/CustomCardChip.jsx";
import CustomTypography from "../layout/CustomTypography.jsx";
import PropTypes from "prop-types";

/**
 * SubMenu component that displays a horizontal chip menu for navigating
 * between meal categories. Adjusts behavior based on login state and current page.
 *
 * - Uses `CustomCardChip` for layout and interaction.
 * - When `isDetailPage` is true, clicking a chip navigates to a filtered meal list.
 * - Otherwise, updates `activeOption` from context.
 *
 * @component
 * @param {Object} props
 * @param {boolean} [props.isDetailPage=false] – If true, chip clicks navigate instead of updating context.
 * @returns {JSX.Element}
 */
function SubMenu({ isDetailPage = false }) {
    const { activeOption, setActiveOption } = useContext(UserMealsContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // Menu options vary based on whether the user is logged in
    const options = user
        ? [
            { label: "All Meals", icon: BookOpen },
            { label: "My Meals", icon: Soup },
            { label: "Created Meals", icon: UserPen },
        ]
        : [{ label: "All Meals", icon: BookOpen }];

    /**
     * Handles selection of a chip
     * - If on a detail page, redirect with query param
     * - Otherwise, update context
     */
    const handleChipClick = (option) => {
        if (isDetailPage) {
            navigate(`/meals?filter=${option}`);
        } else if (activeOption !== option) {
            setActiveOption(option);
        }
    };

    return (
        <CustomBox className="flex justify-center items-center gap-4">
            {options.map(({ label, icon: Icon }) => {
                const selected = label === activeOption;

                return (
                    <CustomBox key={label} className="flex flex-col items-center gap-1">
                        <CustomCardChip
                            onClick={() => handleChipClick(label)}
                            className={`w-16 h-12 flex items-center justify-center border-2 rounded-full transition-colors ${
                                selected
                                    ? "bg-primary border-primary text-white"
                                    : "bg-white dark:bg-gray-800 border-primary text-primary"
                            }`}
                            textClassName="text-xl"
                        >
                            <Icon
                                className={`${selected ? "text-white" : "text-primary"} w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7`}
                            />
                        </CustomCardChip>
                        <CustomTypography
                            as="span"
                            className="text-[0.65rem] sm:text-[0.7rem] md:text-[0.8rem] text-center text-gray-700 dark:text-gray-200"
                        >
                            {label}
                        </CustomTypography>
                    </CustomBox>
                );
            })}
        </CustomBox>
    );
}

SubMenu.propTypes = {
    /** If true, clicking a chip will navigate to /meals?filter=... instead of updating context */
    isDetailPage: PropTypes.bool,
};

export default SubMenu;
