// // src/components/meal/SelectMealsForDay.jsx
// import PropTypes from "prop-types";
// import { useEffect, useState } from "react";
// import useUserMeals from "../../hooks/useUserMeals"; // Zorg dat dit je eigen hook is
// import CustomFloatingSelect from "../layout/CustomFloatingSelect.jsx";
// import CustomBox from "../layout/CustomBox.jsx";
// import CustomTypography from "../layout/CustomTypography.jsx";
// import CustomIconButton from "../layout/CustomIconButton.jsx";
// import { PlusCircle } from "lucide-react";
// import ButtonRemoveFoodItem from "../buttonRemoveFooditem/ButtonRemoveFoodItem.jsx";
//
// const SelectMealsForDay = ({ selectedMeals, onChange }) => {
//     const { options } = useUserMeals(); // deze hook moet meals ophalen als select-opties
//     const lastMeal = selectedMeals[selectedMeals.length - 1] || "";
//     const disableAdd = !lastMeal;
//
//     const getAvailableOptions = (currentIndex) =>
//         options.filter((opt) => {
//             const currentId = selectedMeals[currentIndex];
//             return !selectedMeals.includes(opt.value) || opt.value === currentId;
//         });
//
//     const handleMealChange = (index, selectedOption) => {
//         const newMeals = [...selectedMeals];
//         newMeals[index] = selectedOption ? selectedOption.value : "";
//         onChange(newMeals);
//     };
//
//     const handleAddMeal = () => {
//         if (!disableAdd) {
//             onChange([...selectedMeals, ""]);
//         }
//     };
//
//     const handleRemoveMeal = (index) => {
//         const newMeals = selectedMeals.filter((_, i) => i !== index);
//         onChange(newMeals);
//     };
//
//     return (
//         <CustomBox className="max-w-[600px]">
//             {selectedMeals.map((mealId, index) => (
//                 <CustomBox key={index} className="flex gap-2 items-center mb-1">
//                     <CustomFloatingSelect
//                         label="Select Meal"
//                         options={getAvailableOptions(index)}
//                         value={options.find((opt) => opt.value === mealId) || null}
//                         onChange={(selected) => handleMealChange(index, selected)}
//                     />
//                     {mealId && (
//                         <ButtonRemoveFoodItem
//                             value={selectedMeals}
//                             index={index}
//                             onRemove={handleRemoveMeal}
//                         />
//                     )}
//                 </CustomBox>
//             ))}
//
//             <CustomBox className="flex items-center justify-center gap-2 mt-1">
//                 <CustomTypography
//                     as="p"
//                     variant="small"
//                     className={`cursor-pointer ${disableAdd ? "opacity-50" : ""}`}
//                     onClick={handleAddMeal}
//                 >
//                     {selectedMeals.length === 0 || selectedMeals.every((id) => !id)
//                         ? "Add at least one meal"
//                         : "Click to add more meals"}
//                 </CustomTypography>
//
//                 <CustomIconButton
//                     icon={<PlusCircle size={20} className="text-primary" />}
//                     onClick={handleAddMeal}
//                     bgColor="bg-transparent"
//                     disableScale
//                     className={disableAdd ? "opacity-50 pointer-events-none" : ""}
//                 />
//             </CustomBox>
//         </CustomBox>
//     );
// };
//
// SelectMealsForDay.propTypes = {
//     selectedMeals: PropTypes.arrayOf(PropTypes.string).isRequired,
//     onChange: PropTypes.func.isRequired,
// };
//
// export default SelectMealsForDay;
