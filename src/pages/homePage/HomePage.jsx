import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState, useContext } from "react";
import { motion } from "framer-motion";
import {
    ArrowRight,
    CalendarDays,
    ChefHat,
    DollarSign,
    Flame,
    Heart,
    LayoutGrid,
    ShoppingCart,
    Sparkles,
    Target,
    TrendingUp,
    Users,
    Dumbbell,
    ChartColumnIncreasing,
    Droplet,
    Euro,
    Wallet,
    Banknote
} from "lucide-react";
import Interceptor from "../../services/authInterceptor.js";
import { getAllStickyItems } from "../../services/apiService.js";
import fetchStickyItemDetails from "../../utils/helpers/fetchStickyItemDetails.js";
import { UserDietsContext } from "../../context/UserDietContext.jsx";
import { UserMealsContext } from "../../context/UserMealsContext.jsx";
import PageWrapper from "../../components/layout/PageWrapper.jsx";
import { useRef } from "react";

const sectionFade = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const chipBaseClass =
    "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur";

function formatPrice(value) {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
        return "Price unknown";
    }

    return new Intl.NumberFormat("nl-NL", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 2,
    }).format(Number(value));
}

function getMealImage(meal) {
    if (meal?.imageUrls?.length > 0) return meal.imageUrls[0];

    return "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1400&q=80";
}
function getDietImage(index) {
    const images = [
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1400&q=80",
        "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1400&q=80",
        "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=1400&q=80",
    ];

    return images[index % images.length];
}

function getStickyTypeLabel(type) {
    if (type === "MEAL") return "Pinned meal";
    if (type === "DIET_PLAN") return "Pinned diet";
    return "Pinned item";
}

function StatCard({ icon: Icon, label, value, accent }) {
    return (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between">
        <span className={`rounded-2xl border px-3 py-3 ${accent}`}>
          <Icon className="h-5 w-5" />
        </span>
            </div>
            <p className="text-2xl font-semibold text-white">{value}</p>
            <p className="mt-1 text-sm text-white/60">{label}</p>
        </div>
    );
}

function ActionCard({ icon: Icon, title, text, onClick, accentClass, gradient }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`group rounded-3xl border border-white/10
            bg-gradient-to-br ${gradient}
            p-5 text-left shadow-xl backdrop-blur-xl transition duration-300
            hover:-translate-y-1 hover:border-white/20`}
        >
            <div className={`mb-4 inline-flex rounded-2xl border p-3 ${accentClass}`}>
                <Icon className="h-5 w-5" />
            </div>

            <div className="flex items-start justify-between gap-4">
                <div>
                    <h3 className="text-base font-semibold text-white">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/65">{text}</p>
                </div>

                <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-white/40 transition group-hover:translate-x-1 group-hover:text-white" />
            </div>
        </button>
    );
}

function SectionHeader({ eyebrow, title, text, actionLabel, onAction }) {
    return (
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
                {eyebrow && (
                    <span className="mb-3 inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">
            {eyebrow}
          </span>
                )}
                <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">{title}</h2>
                {text && <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65 md:text-base">{text}</p>}
            </div>

            {actionLabel && onAction && (
                <button
                    type="button"
                    onClick={onAction}
                    className="inline-flex items-center gap-2 self-start rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
                >
                    {actionLabel}
                    <ArrowRight className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}

function FeaturedMealCard({ meal, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="group relative min-w-[320px] overflow-hidden rounded-[28px] border border-white/10 bg-zinc-900 text-left shadow-2xl"
        >
            <div className="absolute inset-0">
                <img
                    src={getMealImage(meal)}
                    alt={meal?.name || meal?.title || "Meal"}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            <div className="relative flex h-[420px] flex-col justify-between p-5">
                <div className="flex items-start justify-between gap-3">
                    <span className={chipBaseClass}>
                        <Sparkles className="h-3.5 w-3.5" />
                        Featured meal
                    </span>
                    {meal?.publicVisible && <span className={chipBaseClass}>Public</span>}
                </div>

                <h3 className="text-xl font-semibold text-white line-clamp-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                    {meal?.name || meal?.title || "Untitled meal"}
                </h3>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-white/80">

                    <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3 backdrop-blur">
                        <Flame className="h-6 w-6 text-error" />
                        <div>
                            <p className="text-white text-xs">kcal</p>
                            <p className="font-semibold text-white">
                                {meal?.totalCalories !== undefined ? Math.round(meal.totalCalories) : "-"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3 backdrop-blur">
                        <Dumbbell className="h-6 w-6 text-cyan-400" />
                        <div>
                            <p className="text-white text-xs">protein</p>
                            <p className="font-semibold text-white">
                                {meal?.totalProtein !== undefined ? Math.round(meal.totalProtein) : "-"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3 backdrop-blur">
                        <ChartColumnIncreasing className="h-6 w-6 text-emerald-400" />
                        <div>
                            <p className="text-white text-xs">carbs</p>
                            <p className="font-semibold text-white">
                                {meal?.totalCarbs !== undefined ? Math.round(meal.totalCarbs) : "-"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3 backdrop-blur">
                        <Droplet className="h-6 w-6 text-fuchsia-400" />
                        <div>
                            <p className="text-white text-xs">fat</p>
                            <p className="font-semibold text-white">
                                {meal?.totalFat !== undefined ? Math.round(meal.totalFat) : "-"}
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </button>
    );
}

function CompactMealCard({meal, onClick}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="group min-w-[280px] overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.06] text-left shadow-xl backdrop-blur transition duration-300 hover:-translate-y-1"
        >
            <div className="relative h-44 overflow-hidden">
                <img
                    src={getMealImage(meal)}
                    alt={meal?.name || "Meal"}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"/>
                <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
                    {meal?.diets?.length > 0 && <span className={chipBaseClass}>{meal.diets[0]}</span>}
                    {meal?.cuisines?.length > 0 && <span className={chipBaseClass}>{meal.cuisines[0]}</span>}
                </div>
            </div>

            <div className="mt-4 px-2 grid grid-cols-3 gap-2 text-xs">

                <div
                    className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-white/10 bg-black/20 px-2 py-3 text-white/80">
                    <Flame className="h-4 w-4 text-error"/>
                    <div>

                        <p className="font-semibold text-white">
                            {meal?.totalCalories !== undefined ? Math.round(meal.totalCalories) : "-"}
                        </p>
                    </div>
                </div>

                <div
                    className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-white/10 bg-black/20 px-2 py-3 text-white/80">
                    <Dumbbell className="h-4 w-4 text-cyan-400"/>
                    <div>
                        <p className="font-semibold text-white">
                            {meal?.totalProtein !== undefined ? Math.round(meal.totalProtein) : "-"}
                        </p>
                    </div>
                </div>

                <div
                    className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-white/10 bg-black/20 px-2 py-3 text-white/80">
                    <Wallet className="h-4 w-4 text-price"/>
                    <div>
                        <p className="font-semibold text-white">
                            {meal?.mealPrice ? formatPrice(meal.mealPrice) : "-"}
                        </p>
                    </div>
                </div>

            </div>
        </button>
    );
}

function DietHighlightCard({diet, index, onClick}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="group relative min-w-[320px] overflow-hidden rounded-[28px] border border-white/10 text-left shadow-2xl"
        >
            <div className="absolute inset-0">
                <img
                    src={getDietImage(index)}
                    alt={diet?.name || diet?.title || "Diet plan"}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20"/>
            </div>

            <div className="relative flex h-[340px] flex-col justify-between p-5">
                <div className="flex items-center justify-between">
          <span className={chipBaseClass}>
            <CalendarDays className="h-3.5 w-3.5"/>
            Diet plan
          </span>
                    {diet?.publicVisible && <span className={chipBaseClass}>Public</span>}
                </div>

                <div>
                    <h3 className="text-2xl font-semibold text-white">{diet?.name || diet?.title || "Untitled diet"}</h3>
                    <p className="mt-2 max-w-md text-sm leading-6 text-white/70 line-clamp-3">
                        {diet?.description || "Structured nutrition plan with meals, budget awareness and daily guidance."}
                    </p>

                    <div className="mt-5 grid grid-cols-3 gap-3 text-sm text-white/85">
                        <div className="rounded-2xl bg-white/10 p-3 backdrop-blur">
                            <p className="text-white/50">Days</p>
                            <p className="mt-1 font-semibold text-white">{diet?.days?.length ?? diet?.numberOfDays ?? "-"}</p>
                        </div>
                        <div className="rounded-2xl bg-white/10 p-3 backdrop-blur">
                            <p className="text-white/50">Meals</p>
                            <p className="mt-1 font-semibold text-white">{diet?.meals?.length ?? diet?.mealCount ?? "-"}</p>
                        </div>
                        <div className="rounded-2xl bg-white/10 p-3 backdrop-blur">
                            <p className="text-white/50">Budget</p>
                            <p className="mt-1 font-semibold text-white">{diet?.totalPrice ? formatPrice(diet.totalPrice) : "Estimate"}</p>
                        </div>
                    </div>
                </div>
            </div>
        </button>
    );
}

function StickySpotlightCard({ item, onClick }) {
    const isMeal = item?.type === "MEAL";
    const reference = item?.reference;

    return (
        <button
            type="button"
            onClick={onClick}
            className="group overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.06] text-left shadow-xl backdrop-blur transition duration-300 hover:-translate-y-1"
        >
            <div className="relative h-48 overflow-hidden">
                <img
                    src={isMeal ? getMealImage(reference) : getDietImage(reference?.id || 0)}
                    alt={reference?.name || reference?.title || "Pinned item"}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"/>
                <div className="absolute left-4 top-4">
                   <span className={chipBaseClass}>
    {item?.promoted ? "Sponsored" : getStickyTypeLabel(item?.type)}
</span>
                </div>
            </div>

            <div className="p-5">
                <h3 className="line-clamp-1 text-lg font-semibold text-white">{reference?.name || reference?.title || "Pinned item"}</h3>
                <p className="mt-2 text-sm leading-6 text-white/65 line-clamp-2">
                    {isMeal
                        ? reference?.mealDescription || "Quick access to one of your saved meals."
                        : reference?.description || "Fast access to a saved plan you want to revisit."}
                </p>
            </div>
        </button>
    );
}

export default function HomePage() {
    const navigate = useNavigate();
    const [vegetarianMeals, setVegetarianMeals] = useState([]);
    const [highProteinMeals, setHighProteinMeals] = useState([]);
    const [allMeals, setAllMeals] = useState([]);
    const [stickyItems, setStickyItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const { userMeals, applyUserCopies } = useContext(UserMealsContext);
    const { diets, fetchDietsData } = useContext(UserDietsContext);

    const displayedFeaturedMeals = useMemo(() => allMeals.slice(0, 4), [allMeals]);
    const displayedStickyItems = useMemo(() => stickyItems, [stickyItems]);
    const displayedDiets = useMemo(() => diets.slice(0, 4), [diets]);
    const trendingMeals = useMemo(() => {
        return [...allMeals]
            .sort((a, b) => b.saveCount - a.saveCount)
            .slice(0, 10);
    }, [allMeals]);

    const scrollRef = useRef(null);
    const vegRef = useRef(null);
    const proteinRef = useRef(null);


    useEffect(() => {
        const fetchMealsByQuery = async (query) => {
            const token = localStorage.getItem("accessToken");
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const response = await Interceptor.get(`${import.meta.env.VITE_BASE_URL}/meals?${query}`, { headers });
            return response?.data?.content || [];
        };

        const loadHomePageData = async () => {
            setIsLoading(true);

            try {
                const [vegetarianResponse, highProteinResponse, allMealsResponse, rawStickyItems] = await Promise.all([
                    fetchMealsByQuery("page=0&size=12&diets=VEGETARIAN"),
                    fetchMealsByQuery("page=0&size=12&diets=HIGH_PROTEIN"),
                    fetchMealsByQuery("page=0&size=18&includeUserCopies=false"),
                    getAllStickyItems(),
                ]);

                const { meals, diets: stickyDiets } = await fetchStickyItemDetails(rawStickyItems || []);

                const enrichedStickyItems = (rawStickyItems || [])
                    .map((item) => {
                        const reference =
                            item.type === "MEAL"
                                ? meals.find((meal) => meal.id === item.referenceId)
                                : stickyDiets.find((diet) => diet.id === item.referenceId);

                        return { ...item, reference };
                    })
                    .filter((item) => item.reference);

                setStickyItems(enrichedStickyItems);
                setVegetarianMeals(vegetarianResponse.slice(0, 12));
                setHighProteinMeals(highProteinResponse.slice(0, 12));
                setAllMeals(allMealsResponse.slice(0, 18));

                await fetchDietsData();
            } catch (error) {
                console.error("Failed to load homepage data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadHomePageData();
    }, [applyUserCopies, fetchDietsData, userMeals]);

    const stats = [
        {
            icon: ChefHat,
            label: "Meals to explore",
            value: allMeals.length || "50+",
            accent: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
        },
        {
            icon: CalendarDays,
            label: "Diet plans",
            value: diets.length || "10+",
            accent: "border-cyan-400/20 bg-cyan-400/10 text-cyan-200",
        },
        {
            icon: ShoppingCart,
            label: "Budget focused",
            value: "Smart",
            accent: "border-fuchsia-400/20 bg-fuchsia-400/10 text-fuchsia-200",
        },
        {
            icon: TrendingUp,
            label: "Track your intake",
            value: "Daily",
            accent: "border-amber-400/20 bg-amber-400/10 text-amber-200",
        },
    ];

    const quickActions = [
        {
            title: "Discover meals",
            text: "Browse and explore meals that fit your goals",
            icon: ChefHat,
            onClick: () => navigate("/meals"),
            accentClass: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
            gradient: "from-emerald-400/15 via-white/[0.06] to-cyan-400/15"
        },
        {
            title: "Create a diet",
            text: "Build structured plans for your nutrition",
            icon: Target,
            onClick: () => navigate("/create-diet"),
            accentClass: "border-cyan-400/20 bg-cyan-400/10 text-cyan-200",
            gradient: "from-cyan-400/15 via-white/[0.06] to-blue-400/15"
        },
        {
            title: "Shopping list",
            text: "Generate smart lists with pricing",
            icon: ShoppingCart,
            onClick: () => navigate("/shopping"),
            accentClass: "border-amber-400/20 bg-amber-400/10 text-amber-200",
            gradient: "from-amber-400/15 via-white/[0.06] to-orange-400/15"
        },
        {
            title: "Track intake",
            text: "Log your meals and stay on target",
            icon: Flame,
            onClick: () => navigate("/tracker"),
            accentClass: "border-fuchsia-400/20 bg-fuchsia-400/10 text-fuchsia-200",
            gradient: "from-fuchsia-400/15 via-white/[0.06] to-pink-400/15"
        }
    ];


    console.log("TRENDING ORDER:", trendingMeals.map(m => ({
        id: m.id,
        name: m.name,
        saveCount: m.saveCount
    })));


    return (
        <div className="min-h-screen bg-[#050816] text-white">
            <PageWrapper isHome>
                <div className="relative isolate">
                    <div className="absolute inset-0 -z-10 overflow-hidden">
                        <div
                            className="absolute left-1/2 top-[-120px] h-[380px] w-[380px] -translate-x-1/2 rounded-full bg-emerald-500/20 blur-3xl"/>
                        <div
                            className="absolute right-[-120px] top-[120px] h-[320px] w-[320px] rounded-full bg-cyan-500/20 blur-3xl"/>
                        <div
                            className="absolute bottom-[-120px] left-[-80px] h-[280px] w-[280px] rounded-full bg-fuchsia-500/20 blur-3xl"/>
                        <div
                            className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_38%)]"/>
                    </div>

                    <main className="flex w-full flex-col gap-16 pb-20 pt-6 px-4 md:px-6 lg:px-8 lg:pt-10">
                        <motion.section
                            variants={sectionFade}
                            initial="hidden"
                            animate="visible"
                            className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]"
                        >
                            <div
                                className="rounded-[32px] border border-white/10 bg-gradient-to-br from-emerald-400/15 via-white/[0.06] to-cyan-400/15 p-6 shadow-2xl backdrop-blur-xl md:p-8">
                                <div className="mb-5 flex flex-wrap gap-3">
                <span className={chipBaseClass}>
                  <Sparkles className="h-3.5 w-3.5"/>
                  Modern nutrition platform
                </span>
                                    <span className={chipBaseClass}>
                  <Users className="h-3.5 w-3.5"/>
                  Community + personal copies
                </span>
                                </div>

                                <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-white md:text-6xl">
                                    Discover meals. Build diet plans. Stay on budget.
                                </h1>

                                <p className="mt-5 max-w-2xl text-base leading-7 text-white/70 md:text-lg">
                                    BalanceBite combines meal discovery, diet planning, shopping cost control and intake
                                    tracking in one visual workflow.
                                </p>

                                <div className="mt-8 flex flex-wrap gap-4">
                                    <button
                                        type="button"
                                        onClick={() => navigate("/meals", {state: {filtersFromRedirect: {}}})}
                                        className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:scale-[1.02]"
                                    >
                                        Explore meals
                                        <ArrowRight className="h-4 w-4"/>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => navigate("/diets")}
                                        className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                                    >
                                        View diet plans
                                        <CalendarDays className="h-4 w-4"/>
                                    </button>
                                </div>

                                <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                    {stats.map((stat) => (
                                        <StatCard key={stat.label} {...stat} />
                                    ))}
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">

                                {/* 1 - Meal discovery */}
                                <button
                                    type="button"
                                    onClick={() => navigate("/meals")}
                                    className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.06] shadow-2xl backdrop-blur-xl text-left group"
                                >
                                    <div className="relative h-[220px] md:h-[240px]">
                                        <img
                                            src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1600&q=80"
                                            alt="Healthy bowls"
                                            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                                        />
                                        <div
                                            className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"/>
                                        <div
                                            className="absolute bottom-4 left-4 right-4 rounded-3xl border border-white/10 bg-black/35 p-4 backdrop-blur-md">
                                            <p className="text-sm text-emerald-200">Meal discovery</p>
                                            <h3 className="mt-1 text-xl font-semibold text-white">
                                                Find meals that match your goals
                                            </h3>
                                        </div>
                                    </div>
                                </button>

                                {/* 2 - Shopping */}
                                <div
                                    className="rounded-[32px] border border-white/10 bg-gradient-to-br from-emerald-400/15 via-white/[0.06] to-cyan-400/15 p-6 shadow-2xl backdrop-blur-xl">
                                    <div
                                        className="mb-4 inline-flex rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-emerald-200">
                                        <ShoppingCart className="h-5 w-5"/>
                                    </div>
                                    <h3 className="text-xl font-semibold text-white">Smart shopping from your diet</h3>
                                    <p className="mt-3 text-sm leading-6 text-white/70">
                                        Turn planned meals into a shopping list with quantities, price totals and
                                        missing price warnings.
                                    </p>
                                </div>

                                {/* 3 - Personalize */}
                                <div
                                    className="rounded-[32px] border border-white/10 bg-gradient-to-br from-fuchsia-400/15 via-white/[0.06] to-amber-400/15 p-6 shadow-2xl backdrop-blur-xl">
                                    <div
                                        className="mb-4 inline-flex rounded-2xl border border-fuchsia-400/20 bg-fuchsia-400/10 p-3 text-fuchsia-200">
                                        <Heart className="h-5 w-5"/>
                                    </div>
                                    <h3 className="text-xl font-semibold text-white">Make it your own</h3>
                                    <p className="mt-3 text-sm leading-6 text-white/70">
                                        Save meals and diet plans and make them your own so you can customize them
                                        freely and keep everything tailored to your preferences.
                                    </p>
                                </div>

                                {/* 4 - Share */}
                                <div
                                    className="rounded-[32px] border border-white/10 bg-gradient-to-br from-cyan-400/15 via-white/[0.06] to-emerald-400/15 p-6 shadow-2xl backdrop-blur-xl">
                                    <div
                                        className="mb-4 inline-flex rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-3 text-cyan-200">
                                        <Users className="h-5 w-5"/>
                                    </div>
                                    <h3 className="text-xl font-semibold text-white">Share your meals</h3>
                                    <p className="mt-3 text-sm leading-6 text-white/70">
                                        Share your meals and diet plans so others can discover, use and build on what
                                        you’ve created.
                                    </p>
                                </div>

                            </div>
                        </motion.section>

                        <motion.section variants={sectionFade} initial="hidden" whileInView="visible"
                                        viewport={{once: true}}>
                            <SectionHeader
                                eyebrow="Quick start"
                                title="Everything important in one place"
                                text="Quick access to the core features: discover meals, create plans and track your intake."
                            />

                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
                                            className="h-[420px] animate-pulse rounded-[28px] border border-white/10 bg-white/5"
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="relative">

                                    {/* LEFT ARROW */}
                                    <button
                                        onClick={() => scrollRef.current?.scrollBy({left: -320, behavior: "smooth"})}
                                        className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 backdrop-blur hover:bg-black/60"
                                    >
                                        ←
                                    </button>

                                    {/* RIGHT ARROW */}
                                    <button
                                        onClick={() => scrollRef.current?.scrollBy({left: 320, behavior: "smooth"})}
                                        className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 backdrop-blur hover:bg-black/60"
                                    >
                                        →
                                    </button>

                                    {/* SCROLL CONTAINER */}
                                    <div
                                        ref={scrollRef}
                                        className="flex gap-5 overflow-x-auto pb-3 px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                                    >
                                        {trendingMeals.map((meal) => (
                                            <FeaturedMealCard
                                                key={meal.id}
                                                meal={meal}
                                                onClick={() => navigate(`/meals/${meal.id}`)}
                                            />
                                        ))}
                                    </div>

                                    {/* FADE */}
                                    <div
                                        className="pointer-events-none absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-[#050816] to-transparent"/>
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

                                {/* LEFT */}
                                <div className="min-w-0 lg:pr-6 lg:border-r lg:border-white/10">
                                    <SectionHeader
                                        eyebrow="Selection"
                                        title="Vegetarian picks"
                                        text="Fresh, clean and highly visual. Good for inspiration and quick browsing."
                                        actionLabel="More vegetarian"
                                        onAction={() => navigate("/meals?diets=VEGETARIAN")}
                                    />

                                    <div className="relative">

                                        {/* LEFT ARROW */}
                                        <button
                                            onClick={() => vegRef.current?.scrollBy({left: -300, behavior: "smooth"})}
                                            className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 backdrop-blur hover:bg-black/60"
                                        >
                                            ←
                                        </button>

                                        {/* RIGHT ARROW */}
                                        <button
                                            onClick={() => vegRef.current?.scrollBy({left: 300, behavior: "smooth"})}
                                            className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 backdrop-blur hover:bg-black/60"
                                        >
                                            →
                                        </button>

                                        <div
                                            ref={vegRef}
                                            className="flex gap-4 overflow-x-auto pb-3 px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                                        >
                                            {vegetarianMeals.map((meal) => (
                                                <CompactMealCard
                                                    key={meal.id}
                                                    meal={meal}
                                                    onClick={() => navigate(`/meal/${meal.id}`)}
                                                />
                                            ))}
                                        </div>

                                        <div
                                            className="pointer-events-none absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-[#050816] to-transparent"/>
                                    </div>
                                </div>

                                {/* RIGHT */}
                                <div className="min-w-0 lg:pl-6">
                                    <SectionHeader
                                        eyebrow="Performance"
                                        title="High protein"
                                        text="A dedicated section for muscle building, satiety and nutrition goals."
                                        actionLabel="More high protein"
                                        onAction={() => navigate("/meals?diets=HIGH_PROTEIN")}
                                    />

                                    <div className="relative">

                                        {/* LEFT ARROW */}
                                        <button
                                            onClick={() => proteinRef.current?.scrollBy({
                                                left: -300,
                                                behavior: "smooth"
                                            })}
                                            className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 backdrop-blur hover:bg-black/60"
                                        >
                                            ←
                                        </button>

                                        {/* RIGHT ARROW */}
                                        <button
                                            onClick={() => proteinRef.current?.scrollBy({
                                                left: 300,
                                                behavior: "smooth"
                                            })}
                                            className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 backdrop-blur hover:bg-black/60"
                                        >
                                            →
                                        </button>

                                        <div
                                            ref={proteinRef}
                                            className="flex gap-4 overflow-x-auto pb-3 px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                                        >
                                            {highProteinMeals.map((meal) => (
                                                <CompactMealCard
                                                    key={meal.id}
                                                    meal={meal}
                                                    onClick={() => navigate(`/meal/${meal.id}`)}
                                                />
                                            ))}
                                        </div>

                                        <div
                                            className="pointer-events-none absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-[#050816] to-transparent"/>
                                    </div>
                                </div>

                            </div>
                        </motion.section>

                        <motion.section variants={sectionFade} initial="hidden" whileInView="visible"
                                        viewport={{once: true}}>
                            <div className="grid gap-6 lg:grid-cols-[0.95fr_1fr] items-start">
                                <div
                                    className="rounded-[32px] border border-white/10 bg-gradient-to-br from-emerald-400/15 via-white/[0.06] to-cyan-400/15 p-6 shadow-2xl backdrop-blur-xl md:p-8">
                <span
                    className="mb-4 inline-flex rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
                  Why BalanceBite
                </span>
                                    <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
                                        From inspiration to execution in one flow.
                                    </h2>
                                    <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70 md:text-base">
                                        Most apps focus on only recipes, only tracking or only planning. BalanceBite
                                        connects discovery, personalization, shared content, budgets and daily logging
                                        into one ecosystem.
                                    </p>

                                    <div className="mt-8 grid gap-4 sm:grid-cols-2">
                                        <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                                            <Flame className="h-5 w-5 text-amber-200"/>
                                            <h3 className="mt-4 text-lg font-semibold text-white">Macro aware</h3>
                                            <p className="mt-2 text-sm leading-6 text-white/65">Calories, protein, carbs
                                                and fats are visible where they matter.</p>
                                        </div>
                                        <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                                            <DollarSign className="h-5 w-5 text-emerald-200"/>
                                            <h3 className="mt-4 text-lg font-semibold text-white">Budget aware</h3>
                                            <p className="mt-2 text-sm leading-6 text-white/65">Shopping totals and
                                                ingredient prices support realistic planning.</p>
                                        </div>
                                        <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                                            <Users className="h-5 w-5 text-cyan-200"/>
                                            <h3 className="mt-4 text-lg font-semibold text-white">Community ready</h3>
                                            <p className="mt-2 text-sm leading-6 text-white/65">Public content, sharing
                                                and private copies work together naturally.</p>
                                        </div>
                                        <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                                            <Target className="h-5 w-5 text-fuchsia-200"/>
                                            <h3 className="mt-4 text-lg font-semibold text-white">Goal driven</h3>
                                            <p className="mt-2 text-sm leading-6 text-white/65">Logging intake closes
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
                                                className="md:col-span-2 xl:col-span-3 rounded-[28px] border border-dashed border-white/15 bg-white/[0.04] p-10 text-center text-white/60">
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
                                className="overflow-hidden rounded-[34px] border border-white/10 bg-gradient-to-r from-emerald-400/15 via-cyan-400/10 to-fuchsia-400/15 p-8 shadow-2xl backdrop-blur-xl md:p-10">
                                <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                                    <div>
                  <span
                      className="mb-4 inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/85">
                    Final CTA
                  </span>
                                        <h2 className="text-3xl font-semibold tracking-tight text-white md:text-5xl">
                                            Build your next meal plan with less friction.
                                        </h2>
                                        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/75 md:text-base">
                                            Search smarter, copy safely, manage costs and keep your nutrition aligned
                                            with your goals.
                                        </p>

                                        <div className="mt-8 flex flex-wrap gap-4">

                                            <button
                                                type="button"
                                                onClick={() => navigate("/create-meal")}
                                                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                                            >
                                                Create a meal
                                                <ChefHat className="h-4 w-4"/>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => navigate("/create-diet")}
                                                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:scale-[1.02]"
                                            >
                                                Create a diet plan
                                                <ArrowRight className="h-4 w-4"/>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">

                                        <div
                                            className="rounded-3xl border border-white/10 bg-black/20 p-5 backdrop-blur">
                                            <p className="text-sm text-white/50">What you can do</p>
                                            <p className="mt-2 text-lg font-semibold text-white">
                                                Discover, plan and track your nutrition in one flow
                                            </p>
                                        </div>

                                        <div
                                            className="rounded-3xl border border-white/10 bg-black/20 p-5 backdrop-blur">
                                            <p className="text-sm text-white/50">What makes it unique</p>
                                            <p className="mt-2 text-lg font-semibold text-white">
                                                Fully customizable meals and plans that adapt to you
                                            </p>
                                        </div>

                                        <div
                                            className="rounded-3xl border border-white/10 bg-black/20 p-5 backdrop-blur">
                                            <p className="text-sm text-white/50">Achieve your goals</p>
                                            <p className="mt-2 text-lg font-semibold text-white">
                                                Lose weight, build muscle or follow a structured diet
                                            </p>
                                        </div>

                                        <div
                                            className="rounded-3xl border border-white/10 bg-black/20 p-5 backdrop-blur">
                                            <p className="text-sm text-white/50">Experience</p>
                                            <p className="mt-2 text-lg font-semibold text-white">
                                                Modern, visual and built for real daily use
                                            </p>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </motion.section>
                    </main>
                </div>
            </PageWrapper>
        </div>
    );
}
