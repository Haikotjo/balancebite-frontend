// src/components/subMenu/SubMenu.jsx
import { useContext } from "react";
import { BookOpen, Soup, UserPen } from "lucide-react";
import { AuthContext } from "../../../../context/AuthContext.jsx";
import { UserMealsContext } from "../../../../context/UserMealsContext.jsx";
import SubMenuGeneric from "../../../../components/subMenuGeneric/SubMenuGeneric.jsx";
import PropTypes from "prop-types";

export default function SubMenu({ isDetailPage = false, onSelect }) {
    const { activeOption, setActiveOption } = useContext(UserMealsContext);
    const { user } = useContext(AuthContext);

    const options = user
        ? [
            { label: "All Meals",    icon: <BookOpen    className="w-5 h-5 text-primary" /> },
            { label: "My Meals",     icon: <Soup        className="w-5 h-5 text-primary" /> },
            { label: "Created Meals", icon: <UserPen     className="w-5 h-5 text-primary" /> }
        ]
        : [
            { label: "All Meals",    icon: <BookOpen    className="w-5 h-5 text-primary" /> }
        ];

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
}

SubMenu.propTypes = {
    isDetailPage: PropTypes.bool,
    onSelect: PropTypes.func
};
