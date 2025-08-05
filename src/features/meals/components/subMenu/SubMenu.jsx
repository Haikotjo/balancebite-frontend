import { useContext } from "react";
import { Soup, UserPen, BookOpen } from "lucide-react";
import { AuthContext } from "../../../../context/AuthContext.jsx";
import { UserMealsContext } from "../../../../context/UserMealsContext.jsx";
import SubMenuGeneric from "../../../../components/subMenuGeneric/SubMenuGeneric.jsx";
import PropTypes from "prop-types";

const SubMenu = ({ isDetailPage = false, onSelect }) => {
    const { activeOption, setActiveOption } = useContext(UserMealsContext);
    const { user } = useContext(AuthContext);

    console.log("🟢 SubMenu loaded with activeOption:", activeOption);

    const options = user
        ? [
            { label: "All Meals", icon: BookOpen },
            { label: "My Meals", icon: Soup },
            { label: "Created Meals", icon: UserPen },
        ]
        : [{ label: "All Meals", icon: BookOpen }];

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
