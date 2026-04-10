import { useNavigate } from "react-router-dom";
import { useMemo, useContext } from "react";
import { motion } from "framer-motion";
import {
    ArrowRight,
    ChefHat,
    DollarSign,
    Flame,
    Target,
    Users,
} from "lucide-react";
import { UserDietsContext } from "../../context/UserDietContext.jsx";
import { UserMealsContext } from "../../context/UserMealsContext.jsx";
import PageWrapper from "../../components/layout/PageWrapper.jsx";
import { useRef } from "react";
import {getQuickActions, getStats} from "../../features/homepage/utils/constants/homeConfig.js";
import useHomeData from "../../features/homepage/utils/hooks/useHomeData.js";
import {sectionFade} from "../../features/homepage/utils/constants/homeStyles.js";
import HeroSection from "../../features/homepage/components/heroSection/HeroSection.jsx";
import FeatureGrid from "../../features/homepage/components/featureGrid/FeatureGrid.jsx";
import ActionCard from "../../features/homepage/components/actionCard/ActionCard.jsx";
import SectionHeader from "../../features/homepage/components/sectionHeader/SectionHeader.jsx";
import FeaturedMealCard from "../../features/homepage/components/featuredMealCard/FeaturedMealCard.jsx";
import DietHighlightCard from "../../features/homepage/components/dietHighlightCard/DietHighlightCard.jsx";
import StickySpotlightCard from "../../features/homepage/components/stickySpotlightCard/StickySpotlightCard.jsx";
import ScrollArrow from "../../features/homepage/components/scrollArrow/ScrollArrow.jsx";
import MealScrollSection from "../../features/homepage/components/mealScrollSection/MealScrollSection.jsx";

export default function HomePage() {

    const { userMeals, applyUserCopies } = useContext(UserMealsContext);
    const { diets, fetchDietsData } = useContext(UserDietsContext);

    const {
        vegetarianMeals,
        highProteinMeals,
        allMeals,
        stickyItems,
        isLoading
    } = useHomeData({
        applyUserCopies,
        userMeals,
        fetchDietsData
    });

    const navigate = useNavigate();


const displayedStickyItems = useMemo(() => stickyItems, [stickyItems]);
    const displayedDiets = useMemo(() => diets.slice(0, 4), [diets]);
    const trendingMeals = useMemo(() => {
        return [...allMeals]
            .sort((a, b) => b.saveCount - a.saveCount)
            .slice(0, 10);
    }, [allMeals]);

    const vegIds = useMemo(() => new Set(vegetarianMeals.map(m => m.id)), [vegetarianMeals]);
    const uniqueHighProteinMeals = useMemo(() => highProteinMeals.filter(m => !vegIds.has(m.id)), [highProteinMeals, vegIds]);

    const scrollRef = useRef(null);


    const stats = getStats(allMeals.length, diets.length);
    const quickActions = getQuickActions(navigate);


    return (
        <div className="min-h-screen bg-page text-content">
<PageWrapper isHome>
                    <main className="flex w-full flex-col gap-16 pb-20 pt-6 px-4 md:px-6 lg:px-8 lg:pt-10">
                        <motion.section
                            variants={sectionFade}
                            initial="hidden"
                            animate="visible"
                            className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]"
                        >
                            <HeroSection
                                stats={stats}
                                navigate={navigate}
                            />

                            <FeatureGrid navigate={navigate} />

                        </motion.section>

                        <motion.section variants={sectionFade} initial="hidden" whileInView="visible"
                                        viewport={{once: true}}>
                            <SectionHeader
                                eyebrow="Quick start"
                                title="Everything important in one place"
                                text="Quick access to the core features: discover meals, create plans and track your intake."
                            />

                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                                {quickActions.map((action) => (
                                    <ActionCard key={action.title} {...action} />
                                ))}
                            </div>
                        </motion.section>

                        <motion.section
                            variants={sectionFade}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{once: true}}
                        >
                            <SectionHeader
                                eyebrow="Trending"
                                title="Discover meals that are popular among users."
                                text="Discover meals that have been popular over the past month, based on user activity, saves and overall engagement within the community."
                                actionLabel="View all meals"
                                onAction={() => navigate("/meals", {state: {filtersFromRedirect: {}}})}
                            />

                            {isLoading ? (
                                <div className="grid gap-4 lg:grid-cols-2">
                                    {[...Array(2)].map((_, index) => (
                                        <div
                                            key={index}
                                            className="h-[420px] animate-pulse rounded-[28px] border border-content/10 bg-content/5"
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="relative">

                                    <ScrollArrow direction="left" onClick={() => scrollRef.current?.scrollBy({ left: -320, behavior: "smooth" })} />
                                    <ScrollArrow direction="right" onClick={() => scrollRef.current?.scrollBy({ left: 320, behavior: "smooth" })} />

                                    {/* SCROLL CONTAINER */}
                                    <div
                                        ref={scrollRef}
                                        className="flex gap-5 overflow-x-auto pb-3 px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                                    >
                                        {trendingMeals.map((meal) => (
                                            <FeaturedMealCard
                                                key={meal.id}
                                                meal={meal}
                                                onClick={() => navigate(`/meal/${meal.id}`)}
                                            />
                                        ))}
                                    </div>

                                    {/* FADE */}
                                    <div
                                        className="pointer-events-none absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-page to-transparent"/>
                                </div>
                            )}
                        </motion.section>

                        <motion.section
                            variants={sectionFade}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{once: true}}
                        >
                            <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">

                                <div className="min-w-0 lg:pr-6 lg:border-r lg:border-content/10">
                                    <MealScrollSection
                                        eyebrow="Selection"
                                        title="Vegetarian picks"
                                        text="Plant-based meals without meat or fish. Great for reducing calories and getting more nutrients."
                                        actionLabel="More vegetarian"
                                        onAction={() => navigate("/meals?diets=VEGETARIAN")}
                                        meals={vegetarianMeals}
                                        onMealClick={(meal) => navigate(`/meal/${meal.id}`)}
                                    />
                                </div>

                                <div className="min-w-0 lg:pl-6">
                                    <MealScrollSection
                                        eyebrow="Performance"
                                        title="High protein"
                                        text="A dedicated section for muscle building, satiety and nutrition goals."
                                        actionLabel="More high protein"
                                        onAction={() => navigate("/meals?diets=HIGH_PROTEIN")}
                                        meals={uniqueHighProteinMeals}
                                        onMealClick={(meal) => navigate(`/meal/${meal.id}`)}
                                    />
                                </div>

                            </div>
                        </motion.section>

                        <motion.section variants={sectionFade} initial="hidden" whileInView="visible"
                                        viewport={{once: true}}>
                            <div className="grid gap-6 lg:grid-cols-[0.95fr_1fr] items-start">
                                <div
                                    className="rounded-[32px] border border-content/10 bg-gradient-to-br from-emerald-400/15 via-content/[0.06] to-cyan-400/15 p-6 shadow-2xl backdrop-blur-xl md:p-8">
                <span
                    className="mb-4 inline-flex rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-200">
                  Why BalanceBite
                </span>
                                    <h2 className="text-3xl font-semibold tracking-tight text-content md:text-4xl">
                                        From inspiration to execution in one flow.
                                    </h2>
                                    <p className="mt-4 max-w-2xl text-sm leading-7 text-content/70 md:text-base">
                                        Most apps focus on only recipes, only tracking or only planning. BalanceBite
                                        connects discovery, personalization, shared content, budgets and daily logging
                                        into one ecosystem.
                                    </p>

                                    <div className="mt-8 grid gap-4 sm:grid-cols-2">
                                        <div className="rounded-3xl border border-border bg-surface-sunken p-5">
                                            <Flame className="h-5 w-5 text-amber-600 dark:text-amber-300"/>
                                            <h3 className="mt-4 text-lg font-semibold text-content">Macro aware</h3>
                                            <p className="mt-2 text-sm leading-6 text-content/65">Calories, protein, carbs
                                                and fats are visible where they matter.</p>
                                        </div>
                                        <div className="rounded-3xl border border-border bg-surface-sunken p-5">
                                            <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-300"/>
                                            <h3 className="mt-4 text-lg font-semibold text-content">Budget aware</h3>
                                            <p className="mt-2 text-sm leading-6 text-content/65">Shopping totals and
                                                ingredient prices support realistic planning.</p>
                                        </div>
                                        <div className="rounded-3xl border border-border bg-surface-sunken p-5">
                                            <Users className="h-5 w-5 text-cyan-600 dark:text-cyan-300"/>
                                            <h3 className="mt-4 text-lg font-semibold text-content">Community ready</h3>
                                            <p className="mt-2 text-sm leading-6 text-content/65">Public content, sharing
                                                and private copies work together naturally.</p>
                                        </div>
                                        <div className="rounded-3xl border border-border bg-surface-sunken p-5">
                                            <Target className="h-5 w-5 text-fuchsia-600 dark:text-fuchsia-300"/>
                                            <h3 className="mt-4 text-lg font-semibold text-content">Goal driven</h3>
                                            <p className="mt-2 text-sm leading-6 text-content/65">Logging intake closes
                                                the loop between plan and execution.</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <SectionHeader
                                        eyebrow="Promoted"
                                        title="Featured for you"
                                        text="Selected meals and plans from our partners and sponsors."
                                        actionLabel="View all pinned"
                                        onAction={() => navigate("/pinned")}
                                    />

                                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                        {displayedStickyItems.length > 0 ? (
                                            displayedStickyItems.map((item) => (
                                                <StickySpotlightCard
                                                    key={`${item.type}-${item.referenceId}`}
                                                    item={item}
                                                    onClick={() =>
                                                        navigate(item.type === "MEAL" ? `/meal/${item.reference?.id}` : `/diets/${item.reference?.id}`)
                                                    }
                                                />
                                            ))
                                        ) : (
                                            <div
                                                className="md:col-span-2 xl:col-span-3 rounded-[28px] border border-dashed border-content/15 bg-content/[0.04] p-10 text-center text-content/60">
                                                No pinned items yet.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.section>

                        <motion.section variants={sectionFade} initial="hidden" whileInView="visible"
                                        viewport={{once: true}}>
                            <SectionHeader
                                eyebrow="Plans"
                                title="Explore diet plans visually"
                                text="A stronger presentation for diets makes the homepage feel like a real product, not just a feed of cards."
                                actionLabel="View all diets"
                                onAction={() => navigate("/diets")}
                            />

                            <div
                                className="flex gap-5 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                                {displayedDiets.map((diet, index) => (
                                    <DietHighlightCard key={diet.id} diet={diet} index={index}
                                                       onClick={() => navigate(`/diets/${diet.id}`)}/>
                                ))}
                            </div>
                        </motion.section>

                        <motion.section variants={sectionFade} initial="hidden" whileInView="visible"
                                        viewport={{once: true}}>
                            <div
                                className="overflow-hidden rounded-[34px] border border-content/10 bg-gradient-to-r from-emerald-400/15 via-cyan-400/10 to-fuchsia-400/15 p-8 shadow-2xl backdrop-blur-xl md:p-10">
                                <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                                    <div>
                  <span
                      className="mb-4 inline-flex rounded-full border border-content/15 bg-content/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-content/85">
                    Get started
                  </span>
                                        <h2 className="text-3xl font-semibold tracking-tight text-content md:text-5xl">
                                            Build your next meal plan with less friction.
                                        </h2>
                                        <p className="mt-4 max-w-2xl text-sm leading-7 text-content/75 md:text-base">
                                            Search smarter, copy safely, manage costs and keep your nutrition aligned
                                            with your goals.
                                        </p>

                                        <div className="mt-8 flex flex-wrap gap-4">

                                            <button
                                                type="button"
                                                onClick={() => navigate("/create-meal")}
                                                className="inline-flex items-center gap-2 rounded-full border border-content/15 bg-content/5 px-5 py-3 text-sm font-semibold text-content transition hover:bg-content/10"
                                            >
                                                Create a meal
                                                <ChefHat className="h-4 w-4"/>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => navigate("/create-diet")}
                                                className="inline-flex items-center gap-2 rounded-full bg-content px-5 py-3 text-sm font-semibold text-page transition hover:scale-[1.02]"
                                            >
                                                Create a diet plan
                                                <ArrowRight className="h-4 w-4"/>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">

                                        <div
                                            className="rounded-3xl border border-border bg-surface-sunken p-5 backdrop-blur">
                                            <p className="text-sm text-content/50">What you can do</p>
                                            <p className="mt-2 text-lg font-semibold text-content">
                                                Discover, plan and track your nutrition in one flow
                                            </p>
                                        </div>

                                        <div
                                            className="rounded-3xl border border-border bg-surface-sunken p-5 backdrop-blur">
                                            <p className="text-sm text-content/50">What makes it unique</p>
                                            <p className="mt-2 text-lg font-semibold text-content">
                                                Fully customizable meals and plans that adapt to you
                                            </p>
                                        </div>

                                        <div
                                            className="rounded-3xl border border-border bg-surface-sunken p-5 backdrop-blur">
                                            <p className="text-sm text-content/50">Achieve your goals</p>
                                            <p className="mt-2 text-lg font-semibold text-content">
                                                Lose weight, build muscle or follow a structured diet
                                            </p>
                                        </div>

                                        <div
                                            className="rounded-3xl border border-border bg-surface-sunken p-5 backdrop-blur">
                                            <p className="text-sm text-content/50">Experience</p>
                                            <p className="mt-2 text-lg font-semibold text-content">
                                                Modern, visual and built for real daily use
                                            </p>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </motion.section>
                    </main>
            </PageWrapper>
        </div>
    );
}
