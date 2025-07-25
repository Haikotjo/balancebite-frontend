import PropTypes from "prop-types";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import DietListCard from "../dietListCard/DietListCard.jsx";
import { useContext } from "react";
import { UserDietsContext } from "../../../../context/UserDietContext.jsx";

const DietsList = ({ diets, pinnedDiets = [] }) => {
    const { userDiets } = useContext(UserDietsContext);
    const pinnedDietIds = new Set(pinnedDiets.map(d => String(d.id)));

    const combinedDiets = [
        ...pinnedDiets,
        ...diets.filter(d => !pinnedDietIds.has(String(d.id)))
    ];

    return (
        <CustomBox className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {combinedDiets.map((diet) => {
                const userDietMatch = userDiets.find(userDiet =>
                    String(userDiet.originalDietId) === String(diet.id)
                );
                const dietToRender = userDietMatch || diet;
                const source = userDietMatch ? "user" : "template";

                return (
                    <CustomBox key={`${source}-${dietToRender.id}`} className="break-inside-avoid">
                        <DietListCard
                            diet={dietToRender}
                            isPinned={pinnedDietIds.has(String(diet.id))}
                            compact ={false}
                        />
                    </CustomBox>
                );
            })}
        </CustomBox>
    );
};

DietsList.propTypes = {
    diets: PropTypes.array.isRequired,
    pinnedDiets: PropTypes.array,
};

export default DietsList;
