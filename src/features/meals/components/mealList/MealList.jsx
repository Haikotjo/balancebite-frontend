import PropTypes from "prop-types";
import { useState, useEffect, useMemo } from "react";
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

function useColumnCount() {
    const getCount = () => {
        const w = window.innerWidth;
        if (w >= 1536) return 4;
        if (w >= 1024) return 3;
        if (w >= 768)  return 2;
        return 1;
    };

    const [count, setCount] = useState(getCount);

    useEffect(() => {
        const handler = () => setCount(getCount());
        window.addEventListener("resize", handler);
        return () => window.removeEventListener("resize", handler);
    }, []);

    return count;
}

function MealList({ meals = [], pinnedMeals = [] }) {
    const pinnedIds = new Set(pinnedMeals.map(m => String(m.id)));
    const colCount = useColumnCount();

    // Distribute round-robin so visual order is row-first (1,2,3 across top)
    const columns = useMemo(() => {
        const cols = Array.from({ length: colCount }, () => []);
        meals.forEach((meal, i) => cols[i % colCount].push(meal));
        return cols;
    }, [meals, colCount]);

    // On md+: randomly pre-expand at most one card per column
    const expandedIds = useMemo(() => {
        if (colCount < 2) return new Set();
        const ids = new Set();
        columns.forEach(colMeals => {
            if (colMeals.length === 0) return;
            if (Math.random() > 0.5) {
                const pick = Math.floor(Math.random() * Math.min(colMeals.length, 4));
                ids.add(colMeals[pick].id);
            }
        });
        return ids;
    }, [columns, colCount]);

    return (
        <div className="w-full flex gap-6 py-4">
            {columns.map((colMeals, colIdx) => (
                <div key={colIdx} className="flex-1 min-w-0 flex flex-col gap-6">
                    <AnimatePresence mode="popLayout">
                        {colMeals.map((meal, i) => (
                            <motion.div
                                key={meal.id}
                                custom={colIdx + i * colCount}
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                <SlickMealCard
                                    meal={meal}
                                    isPinned={pinnedIds.has(String(meal.id))}
                                    initialExpanded={expandedIds.has(meal.id)}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            ))}
        </div>
    );
}

MealList.propTypes = {
    meals: PropTypes.array,
    pinnedMeals: PropTypes.array,
};

export default MealList;
