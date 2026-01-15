import React, { useMemo } from "react";

const MealCardNew = ({ meal, viewMode = "page" }) => {
    // 1. Data voorbereiding
    const primaryImage = meal.images?.find(img => img.primary)?.imageUrl || meal.imageUrls[0];
    const secondaryImages = meal.images?.filter(img => !img.primary).slice(0, 3);

    // 2. UI Logic voor de List View (Compacte kaart voor in een lijst)
    if (viewMode === "list") {
        return (
            <div className="group relative flex flex-col md:flex-row w-full max-w-4xl bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-zinc-100 dark:border-zinc-800">
                {/* Image Section */}
                <div className="relative w-full md:w-72 h-48 md:h-auto overflow-hidden">
                    <img
                        src={primaryImage}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        alt={meal.name}
                    />
                    <div className="absolute top-3 left-3 flex gap-1 flex-wrap">
                        {meal.mealTypes?.slice(0, 2).map(type => (
                            <span key={type} className="px-2 py-0.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                {type}
              </span>
                        ))}
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start">
                            <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 group-hover:text-orange-500 transition-colors">
                                {meal.name || "Unnamed Meal"}
                            </h3>
                            <span className="text-lg font-black text-zinc-900 dark:text-white">
                €{meal.mealPrice?.toFixed(2)}
              </span>
                        </div>

                        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 italic">
                            {meal.mealDescription}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-4">
                            <div className="flex items-center gap-1.5">
                                <span className="text-orange-500 text-xs font-bold uppercase">Cuisines:</span>
                                <span className="text-xs text-zinc-600 dark:text-zinc-300">{meal.cuisines?.slice(0, 2).join(", ")}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="text-green-500 text-xs font-bold uppercase">Diets:</span>
                                <span className="text-xs text-zinc-600 dark:text-zinc-300">{meal.diets?.slice(0, 2).join(", ")}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center text-[11px] text-zinc-400 uppercase font-bold tracking-widest">
                        <span>{meal.mealIngredients?.length} Ingredients</span>
                        <span className="text-orange-500 group-hover:translate-x-1 transition-transform">View Recipe →</span>
                    </div>
                </div>
            </div>
        );
    }

    // 3. UI Logic voor de Full Page (Uitgebreid & Meeslepend)
    return (
        <div className="max-w-6xl mx-auto bg-zinc-50 dark:bg-black min-h-screen pb-20">
            {/* Hero Header */}
            <div className="relative h-[50vh] w-full overflow-hidden">
                <img src={primaryImage} className="w-full h-full object-cover" alt={meal.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-50 dark:from-black to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                    <h1 className="text-5xl md:text-7xl font-black text-zinc-900 dark:text-white mb-4 uppercase tracking-tighter italic">
                        {meal.name}
                    </h1>
                    <div className="flex gap-2">
                        {meal.diets?.map(diet => (
                            <span key={diet} className="px-4 py-1 bg-green-500/20 text-green-600 dark:text-green-400 rounded-full text-xs font-bold">
                    {diet}
                 </span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 mt-8">
                {/* Left Column: Description & Method */}
                <div className="lg:col-span-8 space-y-12">
                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-white border-l-4 border-orange-500 pl-4">The Story</h2>
                        <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-wrap">
                            {meal.mealDescription}
                        </p>
                    </section>

                    <section className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-sm">
                        <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-white">Preparation</h2>
                        <div className="text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap leading-loose">
                            {meal.mealPreparation}
                        </div>
                    </section>

                    {/* Media Gallery */}
                    <section className="grid grid-cols-3 gap-4">
                        {secondaryImages.map((img, i) => (
                            <div key={i} className="aspect-square rounded-2xl overflow-hidden hover:opacity-80 transition-opacity cursor-pointer">
                                <img src={img.imageUrl} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </section>
                </div>

                {/* Right Column: Ingredients & Price */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="sticky top-8 space-y-6">
                        <div className="bg-orange-500 p-8 rounded-3xl text-white shadow-xl shadow-orange-500/20">
                            <span className="text-xs font-bold uppercase tracking-widest opacity-80">Estimated Price</span>
                            <div className="text-4xl font-black italic">€{meal.mealPrice?.toFixed(2)}</div>
                        </div>

                        <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800">
                            <h3 className="text-xl font-bold mb-6 text-zinc-900 dark:text-white">Ingredients</h3>
                            <ul className="space-y-4">
                                {meal.mealIngredients?.map((ing, i) => (
                                    <li key={i} className="flex justify-between items-center group">
                    <span className="text-zinc-600 dark:text-zinc-400 group-hover:text-orange-500 transition-colors">
                        {ing.foodItemName}
                    </span>
                                        <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-xs font-mono font-bold">
                        {ing.quantity}g
                    </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MealCardNew;