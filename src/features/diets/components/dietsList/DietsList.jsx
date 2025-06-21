import PropTypes from "prop-types";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import DietListCard from "../dietListCard/DietListCard.jsx";
import {useContext} from "react";
import {UserDietsContext} from "../../../../context/UserDietContext.jsx";

const DietsList = ({ diets, pinnedDiets = [] }) => {
    const { userDiets } = useContext(UserDietsContext);
    const pinnedDietIds = new Set(pinnedDiets.map(d => String(d.id)));

    const combinedDiets = [
        ...pinnedDiets,
        ...diets.filter(d => !pinnedDietIds.has(String(d.id)))
    ];

    return (
        <CustomBox className="columns-1 sm:columns-2 lg:columns-4 gap-4 space-y-4">
            {combinedDiets.map((diet) => {
                const userDietMatch = userDiets.find(userDiet =>
                    String(userDiet.originalDietId) === String(diet.id)
                );
                const dietToRender = userDietMatch || diet;

                return (
                    <CustomBox key={dietToRender.id} className="break-inside-avoid">
                        <DietListCard
                            diet={dietToRender}
                            isPinned={pinnedDietIds.has(String(dietToRender.id))}
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