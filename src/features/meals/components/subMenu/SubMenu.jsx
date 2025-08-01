import { useContext } from "react";
import { AuthContext } from "../../../../context/AuthContext.jsx";
import { UserMealsContext } from "../../../../context/UserMealsContext.jsx";
import SubMenuGeneric from "../../../../components/subMenuGeneric/SubMenuGeneric.jsx";
import PropTypes from "prop-types";

const SubMenu = ({ isDetailPage = false, onSelect }) => {
    const { activeOption, setActiveOption } = useContext(UserMealsContext);
    const { user } = useContext(AuthContext);

    const options = user
        ? ["All Meals", "My Meals", "Created Meals"]
        : ["All Meals"];

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
