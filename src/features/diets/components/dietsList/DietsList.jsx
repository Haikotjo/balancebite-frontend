// src/features/diets/pages/dietsPage/DietsList.jsx
import PropTypes from "prop-types";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import DietListCard from "../../dietListCard/DietListCard.jsx";

const DietsList = ({ diets, onItemClick }) => (
    <CustomBox className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {diets.map((diet) => (
            <div key={diet.id} className="break-inside-avoid">
                <DietListCard diet={diet} onClick={() => onItemClick(diet.id)} />
            </div>
        ))}
    </CustomBox>

);

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