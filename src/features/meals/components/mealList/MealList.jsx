import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";

import SlickMealCard from "../slickMealCard/SlickMealCard.jsx";

const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: Math.min(i * 0.05, 0.4),
            duration: 0.35,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    }),
    exit: {
        opacity: 0,
        scale: 0.97,
        transition: { duration: 0.2, ease: "easeIn" },
    },
};

function MealList({ meals = [], pinnedMeals = [] }) {
    const pinnedIds = new Set(pinnedMeals.map(m => String(m.id)));

    return (
        <ul className="
            w-full
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-3
            gap-6
            py-4
            list-none
            m-0 p-0
        ">
            <AnimatePresence mode="popLayout">
                {meals.map((meal, i) => (
                    <motion.li
                        key={meal.id}
                        custom={i}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="min-w-0"
                    >
                        <SlickMealCard
                            meal={meal}
                            isPinned={pinnedIds.has(String(meal.id))}
                        />
                    </motion.li>
                ))}
            </AnimatePresence>
        </ul>
    );
}

MealList.propTypes = {
    meals: PropTypes.array,
    pinnedMeals: PropTypes.array,
};

export default MealList;
