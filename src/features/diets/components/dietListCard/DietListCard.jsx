import PropTypes from "prop-types";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import CustomCard from "../../../../components/layout/CustomCard.jsx";
import AccordionItem from "../accordionItem/AccordionItem.jsx";
import DietDayAccordion from "../dietDayAccordion/DietDayAccordion.jsx";
import CustomDivider from "../../../../components/layout/CustomDivider.jsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import { useNavigate } from "react-router-dom";
import HorizontalScrollSection from "../../../../components/horizontalScrollSection/HorizontalScrollSection.jsx";
import MealCardCompact from "../../../meals/components/mealCardCompact/MealCardCompact.jsx";
import DietCardActionButtons from "../dietCardActionButtons/DietCardActionButtons.jsx";
import AverageNutrientSummary from "../averageNutrientSummary/AverageNutrientSummary.jsx";
import {UserDietsContext} from "../../../../context/UserDietContext.jsx";
import {useContext, useState} from "react";
import CustomButton from "../../../../components/layout/CustomButton.jsx";
import { Users, UserPen, Maximize } from "lucide-react";
import ImageScrollSection from "../../../../components/imagescrollsection/ImageScrollSection.jsx";
import {twMerge} from "tailwind-merge";
import DietModal from "../dietmodal/DietModal.jsx";
import {useModal} from "../../../../context/useModal.js";

const DietListCard = ({ diet, compact, isPinned }) => {
    const navigate = useNavigate();
    const allMeals = diet.dietDays.flatMap((day) => day.meals || []);
    const { setCreatorIdFilter, setActiveOption } = useContext(UserDietsContext);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const role = diet.createdBy?.roles?.[0]?.roleName?.toUpperCase();
    const imageUrls = diet.dietDays.flatMap((day) =>
        (day.meals || []).map((meal) => meal.imageUrl).filter(Boolean)
    );
    const { openModal } = useModal();

    console.log("DietListCard compact:", compact);
    return (
        <CustomCard isPinned={isPinned} createdByRole={role} className="overflow-hidden">

            {imageUrls.length > 0 ? (
                <CustomBox className={`-mx-4 -mt-4 ${compact ? "mb-0" : "mb-4"} relative`}>
                    <ImageScrollSection images={imageUrls} scrollSpeed={1} />
                    <CustomBox className="absolute top-4 right-4 z-10 px-2 py-2 bg-black/40 rounded-md">
                        <DietCardActionButtons diet={diet} viewMode="card" isPinned={isPinned} />
                    </CustomBox>
                </CustomBox>
            ) : (
                <CustomBox className="mb-2 p-2 flex justify-end">
                    <DietCardActionButtons diet={diet} viewMode="card" isPinned={isPinned} />
                </CustomBox>
            )}





            <CustomBox className={twMerge(compact ? "p-4" : "px-4 pb-2")} >

                {/*<DietCardActionButtons diet={diet} viewMode="card" isPinned={isPinned} />*/}

                {/* Diet title with navigation link */}
                <CustomBox
                    className="mb-2 flex items-center gap-2 max-w-full min-w-0 cursor-pointer hover:text-primary"
                    onClick={() => openModal(<DietModal diet={diet} isPinned={isPinned} />, "diet")}
                >
                    <CustomTypography variant="h4" className="break-words truncate max-w-full">
                        {diet.name}
                    </CustomTypography>
                    <Maximize size={18} className="shrink-0" />
                </CustomBox>



                <CustomDivider className="my-2" />

                {/* Diet description (if provided) */}
                {diet.dietDescription && (
                    <>
                        <CustomTypography variant="paragraph" className="mb-4 italic">
                            {showFullDescription ? (
                                <>
                                    {diet.dietDescription}
                                    {' '}
                                    <CustomBox
                                        as="span"
                                        onClick={() => setShowFullDescription(false)}
                                        className="text-primary underline cursor-pointer"
                                    >
                                        Show less
                                    </CustomBox>
                                </>
                            ) : (
                                <>
                                    {diet.dietDescription.slice(0, 100)}
                                    {diet.dietDescription.length > 100 && (
                                        <>
                                            {' '}
                                            <CustomBox
                                                as="span"
                                                onClick={() => setShowFullDescription(true)}
                                                className="text-primary underline cursor-pointer"
                                            >
                                                Show more...
                                            </CustomBox>
                                        </>
                                    )}
                                </>
                            )}
                        </CustomTypography>

                        <CustomDivider className="mb-2" />
                    </>
                )}


                {/* Average daily macro breakdown */}
                <AverageNutrientSummary
                    diet={diet}
                    dayCount={diet.dietDays.length}
                    isListCard
                    compact={compact}
                />

                {/* All diet days */}
                {!compact && (
                    diet.dietDays.length > 1 ? (
                        <AccordionItem
                            title={(isOpen) =>
                                isOpen
                                    ? `Hide ${diet.dietDays.length} ${diet.dietDays.length === 1 ? "day" : "days"}`
                                    : `Show ${diet.dietDays.length} ${diet.dietDays.length === 1 ? "day" : "days"}`
                            }
                        >
                            {diet.dietDays.map((day) => (
                                <DietDayAccordion key={day.id} day={day} compact />
                            ))}
                        </AccordionItem>
                    ) : (
                        diet.dietDays.map((day) => (
                            <DietDayAccordion key={day.id} day={day} compact />
                        ))
                    )
                )}

                {/* Scrollable overview of all meals in the diet */}
                {allMeals.length > 0 && (
                    <AccordionItem
                        title={(isOpen) =>
                            isOpen
                                ? `Hide meals in diet`
                                : `Show meals in diet`
                        }
                        defaultOpen={false}
                    >
                        <HorizontalScrollSection
                            items={allMeals}
                            renderItem={(meal) => <MealCardCompact meal={meal} />}
                            className="my-0"
                        />
                    </AccordionItem>
                )}

                {/* Creator info (if available) */}
                <CustomBox className="flex items-center justify-between w-full mt-2">
                    {/* Left side: creator + updatedAt */}
                    <CustomBox className="flex items-center gap-4">
                        {diet.createdBy?.userName && (
                            <CustomButton
                                type="button"
                                onClick={() => {
                                    setCreatorIdFilter(diet.createdBy.id);
                                    setActiveOption("All Diets");
                                    if (!window.location.pathname.includes("/diets")) {
                                        navigate("/diets");
                                    }
                                }}
                                className="flex items-center gap-1 bg-transparent text-inherit hover:text-primary"
                            >
                                <UserPen size={14} />
                                <CustomTypography variant="small" className="italic">
                                    {diet.createdBy.userName}
                                </CustomTypography>
                            </CustomButton>
                        )}

                        {diet.updatedAt && (
                            <CustomTypography variant="xsmallCard" className="italic">
                                {new Date(diet.updatedAt).toLocaleDateString()}
                            </CustomTypography>
                        )}
                    </CustomBox>

                    {/* Right side: save count */}
                    {diet.template && diet.saveCount !== undefined && (
                        <CustomTypography
                            variant="xsmallCard"
                            className="italic flex items-center gap-1"
                        >
                            <Users size={14} />
                            {diet.saveCount}
                        </CustomTypography>
                    )}
                </CustomBox>
            </CustomBox>
        </CustomCard>
    );
};

DietListCard.propTypes = {
    diet: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        dietDescription: PropTypes.string,
        template: PropTypes.bool,
        updatedAt: PropTypes.string,
        createdBy: PropTypes.shape({
            id: PropTypes.number.isRequired,
            userName: PropTypes.string.isRequired,
            roles: PropTypes.arrayOf(
                PropTypes.shape({
                    roleName: PropTypes.string.isRequired,
                })
            ),
        }),
        dietDays: PropTypes.array.isRequired,
        saveCount: PropTypes.number,
    }).isRequired,
    compact: PropTypes.bool,
    isPinned: PropTypes.bool,
    onClick: PropTypes.func,
};


export default DietListCard;
