import PropTypes from "prop-types";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import DietListCard from "../dietListCard/DietListCard.jsx";
import {useContext} from "react";
import {UserDietsContext} from "../../../../context/UserDietContext.jsx";

const DietsList = ({ diets, onItemClick }) => {
    const { userDiets } = useContext(UserDietsContext);


    return (

        <CustomBox className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">

            {diets.map((diet) => {
                const userDietMatch = userDiets.find(userDiet =>
                    String(userDiet.originalDietId) === String(diet.id)
                );
                const dietToRender = userDietMatch || diet;

                return (
                    <CustomBox key={dietToRender.id} className="break-inside-avoid">
                        <DietListCard diet={dietToRender} onClick={() => onItemClick(dietToRender.id)} />
                    </CustomBox>
                );
            })}
        </CustomBox>
    );
};

DietsList.propTypes = {
    diets: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            dietDays: PropTypes.array.isRequired,
        })
    ).isRequired,
    onItemClick: PropTypes.func.isRequired,
};

export default DietsList;