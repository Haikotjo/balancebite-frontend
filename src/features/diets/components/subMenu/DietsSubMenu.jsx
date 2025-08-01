// src/components/subMenu/DietSubMenu.jsx
import { useContext } from "react";
import { BookOpen, Soup, UserPen } from "lucide-react";
import { AuthContext } from "../../../../context/AuthContext.jsx";
import { UserDietsContext } from "../../../../context/UserDietContext.jsx";
import SubMenuGeneric from "../../../../components/subMenuGeneric/SubMenuGeneric.jsx";
import PropTypes from "prop-types";

export default function DietSubMenu({ isDetailPage = false, onSelect }) {
    const { activeOption, setActiveOption } = useContext(UserDietsContext);
    const { user } = useContext(AuthContext);

    const options = user
        ? [
            { label: "All Diets",    icon: <BookOpen    className="w-5 h-5 text-primary" /> },
            { label: "My Diets",     icon: <Soup        className="w-5 h-5 text-primary" /> },
            { label: "Created Diets", icon: <UserPen     className="w-5 h-5 text-primary" /> }
        ]
        : [
            { label: "All Diets",    icon: <BookOpen    className="w-5 h-5 text-primary" /> }
        ];

    return (
        <SubMenuGeneric
            options={options}
            activeOption={!isDetailPage ? activeOption : ""}
            setActiveOption={!isDetailPage ? setActiveOption : () => {}}
            basePath="/diets"
            isDetailPage={isDetailPage}
            onSelect={onSelect}
        />
    );
}

DietSubMenu.propTypes = {
    isDetailPage: PropTypes.bool,
    onSelect: PropTypes.func
};
