import { useContext } from "react";
import { AuthContext } from "../../../../context/AuthContext.jsx";
import { UserDietsContext } from "../../../../context/UserDietContext.jsx";
import SubMenuGeneric from "../../../../components/subMenuGeneric/SubMenuGeneric.jsx";
import PropTypes from "prop-types";

const DietSubMenu = ({ isDetailPage = false, onSelect }) => {
    const { activeOption, setActiveOption } = useContext(UserDietsContext);
    const { user } = useContext(AuthContext);

    const options = user
        ? ["All Diets", "My Diets", "Created Diets"]
        : ["All Diets"];

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
};

DietSubMenu.propTypes = {
    isDetailPage: PropTypes.bool,
    onSelect: PropTypes.func,
};

export default DietSubMenu;
