import PropTypes from "prop-types";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import AccordionItem from "../../../diets/components/accordionItem/AccordionItem.jsx";
import MealFilterContent from "../mealfiltercontent/MealFilterContent.jsx";

export default function ResponsiveMealFilter({ filters, setFilters }) {
    return (
        <>
            <CustomBox className="block md:hidden w-full">
                <AccordionItem title="Nutrient range filter">
                    <MealFilterContent filters={filters} setFilters={setFilters} />
                </AccordionItem>
            </CustomBox>

            <CustomBox className="hidden md:block w-full">
                <MealFilterContent filters={filters} setFilters={setFilters} />
            </CustomBox>
        </>
    );
}

ResponsiveMealFilter.propTypes = {
    filters: PropTypes.object.isRequired,
    setFilters: PropTypes.func.isRequired,
};
