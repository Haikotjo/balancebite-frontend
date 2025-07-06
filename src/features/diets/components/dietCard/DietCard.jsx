import PropTypes from "prop-types";
import DietDayCard from "../dietDayCard/DietDayCard.jsx";
import AccordionItem from "../accordionItem/AccordionItem.jsx";
import {formatEnum} from "../../../../utils/helpers/formatEnum.js";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import DietCardActionButtons from "../dietCardActionButtons/DietCardActionButtons.jsx";
import AverageNutrientSummary from "../averageNutrientSummary/AverageNutrientSummary.jsx";
import { Users, UserPen } from "lucide-react";
import CustomButton from "../../../../components/layout/CustomButton.jsx";
import {useContext, useEffect} from "react";
import {UserDietsContext} from "../../../../context/UserDietContext.jsx";
import {useNavigate} from "react-router-dom";
import ImageScrollSection from "../../../../components/imagescrollsection/ImageScrollSection.jsx";

const DietCard = ({ diet, viewMode = "card", isPinned = false }) => {
    const { setCreatorIdFilter, setActiveOption } = useContext(UserDietsContext);
    const navigate = useNavigate();
    const imageUrls = diet.dietDays.flatMap((day) =>
        (day.meals || []).map((meal) => meal.imageUrl).filter(Boolean)
    );

    useEffect(() => {
        console.log("Received diet:", diet);
    }, [diet]);

    return (
        <CustomBox
            className={`w-full rounded-xl shadow-md bg-cardLight dark:bg-cardDark overflow-hidden ${
                isPinned ? "border-2 border-yellow-500" : ""
            }`}
        >
            {imageUrls.length > 0 && (
                <CustomBox className="-mx-4 -mt-4 mb-4 rounded-t-xl overflow-hidden">
                    <ImageScrollSection images={imageUrls} scrollSpeed={1} />
                </CustomBox>
            )}

            <CustomBox className="p-4">
                <CustomBox className="flex flex-wrap justify-between items-start gap-y-2 mb-2">
                    <CustomTypography
                        variant="h1"
                        bold
                        className="mr-4 break-words max-w-full"
                    >
                        {diet.name}
                    </CustomTypography>
                    <DietCardActionButtons diet={diet} viewMode={viewMode} />
                </CustomBox>

            <CustomBox className="flex items-center gap-4 mb-2">
                <CustomButton
                    type="button"
                    onClick={() => {
                        setCreatorIdFilter(diet.createdBy.id);
                        setActiveOption("All Diets");
                        if (!window.location.pathname.includes("/diets")) {
                            navigate("/diets");
                        }
                    }}
                    className="bg-transparent hover:text-primary p-0 flex items-center gap-2"
                >
                    <UserPen size={16} color="currentColor" className="text-lightText dark:text-darkText" />
                    <CustomTypography variant="paragraphCard" className="italic">
                        {diet.createdBy.userName}
                    </CustomTypography>
                </CustomButton>

                {diet.saveCount !== undefined && (
                    <CustomTypography variant="paragraphCard" className="italic flex items-center gap-2">
                        <Users size={16} /> {diet.saveCount}
                    </CustomTypography>
                )}
            </CustomBox>


            {diet.dietDescription && (
                <CustomBox>
                    <AccordionItem title="Description" defaultOpen={true}>
                        <CustomTypography variant="paragraphCard" className="italic">
                            {diet.dietDescription}
                        </CustomTypography>
                    </AccordionItem>
                </CustomBox>
            )}

            {/* Average daily macro breakdown */}
                <CustomBox className="my-4">
                    <AverageNutrientSummary diet={diet} dayCount={diet.dietDays.length} showDivider={false} />
                </CustomBox>

            {diet.diets?.length > 0 && (
                <CustomBox className="mb-4">
                    <AccordionItem title="Diets" >
                        <CustomBox className="flex flex-wrap gap-2 pl-4">
                            {diet.diets.map((dietName, index) => (
                                <CustomTypography
                                    key={index}
                                    variant="paragraphCard"
                                    italic
                                    className="w-full sm:w-[calc(33.333%-0.5rem)]"
                                >
                                    {formatEnum(dietName)}
                                </CustomTypography>
                            ))}
                        </CustomBox>
                    </AccordionItem>
                </CustomBox>
            )}



            {diet.dietDays?.map((day) => (
                <CustomBox key={day.id}>
                    <DietDayCard day={day} />
                </CustomBox>
            ))}

            </CustomBox>
        </CustomBox>
    );
};

DietCard.propTypes = {
    diet: PropTypes.object.isRequired,
    viewMode: PropTypes.oneOf(["page", "modal", "card"]),
    isPinned: PropTypes.bool,
};

export default DietCard;