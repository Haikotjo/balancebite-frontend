import { useContext } from "react";
import * as LucideIcons from "lucide-react";
import { AuthContext } from "../../../../context/AuthContext.jsx";
import { UserMealsContext } from "../../../../context/UserMealsContext.jsx";
import SubMenuGeneric from "../../../../components/subMenuGeneric/SubMenuGeneric.jsx";
import PropTypes from "prop-types";

const SubMenu = ({ isDetailPage = false, onSelect }) => {
    const { activeOption, setActiveOption } = useContext(UserMealsContext);
    const { user } = useContext(AuthContext);

    const options = user
        ? [
            { label: "All Meals", icon: LucideIcons.BookOpen },
            { label: "My Meals", icon: LucideIcons.Soup },
            { label: "Created Meals", icon: LucideIcons.UserPen },
        ]
        : [{ label: "All Meals", icon: LucideIcons.BookOpen }];

    return (
        <SubMenuGeneric
            options={options}
            activeOption={!isDetailPage ? activeOption : ""}
            setActiveOption={!isDetailPage ? setActiveOption : () => {}}
            basePath="/meals"
            isDetailPage={isDetailPage}
            onSelect={onSelect}
        />
    );
};

SubMenu.propTypes = {
    isDetailPage: PropTypes.bool,
    onSelect: PropTypes.func,
};

export default SubMenu;
