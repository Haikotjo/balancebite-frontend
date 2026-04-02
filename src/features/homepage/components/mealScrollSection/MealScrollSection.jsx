import PropTypes from "prop-types";
import { useRef } from "react";
import SectionHeader from "../sectionHeader/SectionHeader.jsx";
import ScrollArrow from "../scrollArrow/ScrollArrow.jsx";
import CompactMealCard from "../CompactMealCard/CompactMealCard.jsx";

export default function MealScrollSection({ eyebrow, title, text, actionLabel, onAction, meals, onMealClick }) {
    const scrollRef = useRef(null);

    return (
        <div className="min-w-0">
            <div className="min-h-[10rem]">
                <SectionHeader
                    eyebrow={eyebrow}
                    title={title}
                    text={text}
                    actionLabel={actionLabel}
                    onAction={onAction}
                />
            </div>

            <div className="relative">
                <ScrollArrow direction="left" onClick={() => scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" })} />
                <ScrollArrow direction="right" onClick={() => scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" })} />

                <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto pb-3 px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                    {meals.map((meal) => (
                        <CompactMealCard
                            key={meal.id}
                            meal={meal}
                            onClick={() => onMealClick(meal)}
                        />
                    ))}
                </div>

                <div className="pointer-events-none absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-page to-transparent" />
            </div>
        </div>
    );
}

MealScrollSection.propTypes = {
    eyebrow: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    actionLabel: PropTypes.string.isRequired,
    onAction: PropTypes.func.isRequired,
    meals: PropTypes.array.isRequired,
    onMealClick: PropTypes.func.isRequired,
};
