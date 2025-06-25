// import PropTypes from "prop-types";
// import { CircleX } from "lucide-react";
// import CustomBox from "../../../../components/layout/CustomBox.jsx";
// import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
// import {formatEnum} from "../../../../utils/helpers/formatEnum.js";
//
// /**
//  * ActiveFilters component – displays active filters as chips with a close icon.
//  *
//  * @param {Object} filters - an object mapping each filter category to its selected value(s)
//  * @param {Function} onFilterClick - callback invoked when a filter is removed; receives the category key
//  */
// const ActiveFilters = ({ filters, onFilterClick }) => (
//     <CustomBox className="flex justify-center items-center flex-wrap gap-2">
//         {Object.entries(filters).map(([key, value]) => {
//             if (key === "creatorId") {
//                 return (
//                     <CustomBox
//                         key={key}
//                         className="flex items-center bg-gray-100 dark:bg-gray-800 border border-primary rounded-full px-3 py-1"
//                     >
//                         <CustomTypography as="span" className="text-xs font-bold mr-2">
//                             {filters.creatorUserName}
//                         </CustomTypography>
//                         <CircleX
//                             size={16}
//                             className="cursor-pointer text-primary hover:text-red-500"
//                             onClick={() => onFilterClick("creatorId")}
//                         />
//                     </CustomBox>
//                 );
//             }
//             if (key === "creatorUserName") {
//                 return null;
//             }
//             return (
//                 <CustomBox
//                     key={key}
//                     className="flex items-center bg-gray-100 dark:bg-gray-800 border border-primary rounded-full px-3 py-1"
//                 >
//                     <CustomTypography as="span" className="text-xs font-bold mr-2">
//                         {formatEnum(value)}
//                     </CustomTypography>
//                     <CircleX
//                         size={16}
//                         className="cursor-pointer text-primary hover:text-red-500"
//                         onClick={() => onFilterClick(key)}
//                     />
//                 </CustomBox>
//             );
//         })}
//     </CustomBox>
// );
// ;
//
// ActiveFilters.propTypes = {
//     filters: PropTypes.object.isRequired,
//     onFilterClick: PropTypes.func.isRequired,
// };
//
// export default ActiveFilters;
