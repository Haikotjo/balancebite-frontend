import { useContext } from "react";
import { Soup, UserPen, BookOpen } from "lucide-react";
import { AuthContext } from "../../../../context/AuthContext.jsx";

import SubMenuGeneric from "../../../../components/subMenuGeneric/SubMenuGeneric.jsx";
import PropTypes from "prop-types";
import {UserDietsContext} from "../../../../context/UserDietContext.jsx";

const DietSubMenu = ({ isDetailPage = false }) => {
    const { activeOption, setActiveOption } = useContext(UserDietsContext);
    const { user } = useContext(AuthContext);

    const options = user
        ? [
            { label: "All Diets", icon: BookOpen },
            { label: "My Diets", icon: Soup },
            { label: "Created Diets", icon: UserPen },
        ]
        : [{ label: "All Diets", icon: BookOpen }];


    return (
        <SubMenuGeneric
            options={options}
            activeOption={!isDetailPage ? activeOption : ""}
            setActiveOption={!isDetailPage ? setActiveOption : () => {}}
            basePath="/diets"
            isDetailPage={isDetailPage}
        />
    );
};

DietSubMenu.propTypes = {
    isDetailPage: PropTypes.bool,
};

export default DietSubMenu;
