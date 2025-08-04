import { useContext } from "react";
import { Soup, UserPen, BookOpen } from "lucide-react";
import { AuthContext } from "../../../../context/AuthContext.jsx";
import { UserMealsContext } from "../../../../context/UserMealsContext.jsx";
import SubMenuGeneric from "../../../../components/subMenuGeneric/SubMenuGeneric.jsx";
import PropTypes from "prop-types";

const SubMenu = ({ isDetailPage = false, onSelect }) => {
    const { activeOption, setActiveOption } = useContext(UserMealsContext);
    const { user } = useContext(AuthContext);

    const options = user
        ? [
            { label: "All Meals", icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" /> },
            { label: "My Meals", icon: <Soup className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" /> },
            { label: "Created Meals", icon: <UserPen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" /> },
        ]
        : [{ label: "All Meals", icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" /> }];

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
