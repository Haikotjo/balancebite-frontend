import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ArrowRight,
    ChefHat,
    DollarSign,
    Flame,
    Heart,
    Handshake,
    Users,
    Dumbbell,
    ShoppingCart,
    Target,
} from "lucide-react";
import PageWrapper from "../../components/layout/PageWrapper.jsx";
import SectionHeader from "../../features/homepage/components/sectionHeader/SectionHeader.jsx";
import { sectionFade } from "../../features/homepage/utils/constants/homeStyles.js";

export default function AboutPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-page text-content">
            <PageWrapper>
                <main className="flex w-full flex-col gap-16 pb-20 pt-6 px-4 md:px-6 lg:px-8 lg:pt-10">

                    {/* Hero — personal story */}
                    <motion.section
                        variants={sectionFade}
                        initial="hidden"
                        animate="visible"
                        className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]"
                    >
                        <div className="rounded-[32px] border border-content/10 bg-gradient-to-br from-emerald-400/15 via-content/[0.06] to-cyan-400/15 p-6 shadow-2xl backdrop-blur-xl md:p-8">
                            <div className="mb-5 flex flex-wrap gap-3">
                                <span className="inline-flex items-center gap-2 rounded-full border border-content/40 bg-content/5 px-3 py-1 text-xs font-medium backdrop-blur text-content">
                                    The story behind BalanceBite
                                </span>
                            </div>

                            <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-content md:text-5xl">
                                Sport, nutrition and the question: can this actually be affordable?
                            </h1>

                            <p className="mt-5 max-w-2xl text-base leading-7 text-content/70 md:text-lg">
                                I have been active for years — running, strength training, cycling. Movement has always been part of my life.
                                But the moment I started paying attention to what I was actually eating, everything changed.
                            </p>

                            <p className="mt-4 max-w-2xl text-base leading-7 text-content/70 md:text-lg">
                                I wanted to lose weight, build muscle and eat well — without spending a fortune on groceries every month.
                                That combination turned out to be surprisingly hard to find. Healthy food? Sure. Affordable? Much harder.
                                Real insight into what you are actually consuming? Almost nowhere in one place.
                            </p>

                            <p className="mt-4 max-w-2xl text-base leading-7 text-content/70 md:text-lg">
                                That is why I built BalanceBite.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-4">
                                <button
                                    type="button"
                                    onClick={() => navigate("/meals")}
                                    className="inline-flex items-center gap-2 rounded-full bg-content px-5 py-3 text-sm font-semibold text-page transition hover:scale-[1.02]"
                                >
                                    Explore meals
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate("/diets")}
                                    className="inline-flex items-center gap-2 rounded-full border border-content/15 bg-content/5 px-5 py-3 text-sm font-semibold text-content transition hover:bg-content/10"
                                >
                                    View diet plans
                                </button>
                            </div>
                        </div>

                        {/* Story highlights */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="rounded-3xl border border-border bg-surface-sunken p-5">
                                <Dumbbell className="h-5 w-5 text-cyan-600 dark:text-cyan-300" />
                                <h3 className="mt-4 text-lg font-semibold text-content">Sport as a foundation</h3>
                                <p className="mt-2 text-sm leading-6 text-content/65">
                                    Years of being active — but only when nutrition was added did real results follow.
                                </p>
                            </div>
                            <div className="rounded-3xl border border-border bg-surface-sunken p-5">
                                <Flame className="h-5 w-5 text-amber-600 dark:text-amber-300" />
                                <h3 className="mt-4 text-lg font-semibold text-content">Losing weight & performing</h3>
                                <p className="mt-2 text-sm leading-6 text-content/65">
                                    Counting calories was a start, but understanding macros made the real difference.
                                </p>
                            </div>
                            <div className="rounded-3xl border border-border bg-surface-sunken p-5">
                                <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                                <h3 className="mt-4 text-lg font-semibold text-content">Budget as a real factor</h3>
                                <p className="mt-2 text-sm leading-6 text-content/65">
                                    Eating healthy does not have to be expensive — but you do need insight into the costs.
                                </p>
                            </div>
                            <div className="rounded-3xl border border-border bg-surface-sunken p-5">
                                <Heart className="h-5 w-5 text-rose-500 dark:text-rose-400" />
                                <h3 className="mt-4 text-lg font-semibold text-content">Built from experience</h3>
                                <p className="mt-2 text-sm leading-6 text-content/65">
                                    Not theory — a tool I personally needed and could not find anywhere.
                                </p>
                            </div>
                        </div>
                    </motion.section>

                    {/* What the app does */}
                    <motion.section
                        variants={sectionFade}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <div className="rounded-[32px] border border-content/10 bg-gradient-to-br from-emerald-400/15 via-content/[0.06] to-cyan-400/15 p-6 shadow-2xl backdrop-blur-xl md:p-8">
                            <span className="mb-4 inline-flex rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-200">
                                What BalanceBite does
                            </span>
                            <h2 className="text-3xl font-semibold tracking-tight text-content md:text-4xl">
                                From inspiration to execution in one flow.
                            </h2>
                            <p className="mt-4 max-w-2xl text-sm leading-7 text-content/70 md:text-base">
                                Most apps focus on only recipes, only tracking, or only planning.
                                BalanceBite connects discovery, personalization, shared content, budget management
                                and daily logging into one ecosystem.
                            </p>

                            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <div className="rounded-3xl border border-border bg-surface-sunken p-5">
                                    <Flame className="h-5 w-5 text-amber-600 dark:text-amber-300" />
                                    <h3 className="mt-4 text-lg font-semibold text-content">Macro aware</h3>
                                    <p className="mt-2 text-sm leading-6 text-content/65">
                                        Calories, protein, carbs and fats visible where they matter.
                                    </p>
                                </div>
                                <div className="rounded-3xl border border-border bg-surface-sunken p-5">
                                    <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                                    <h3 className="mt-4 text-lg font-semibold text-content">Budget aware</h3>
                                    <p className="mt-2 text-sm leading-6 text-content/65">
                                        Shopping totals and ingredient prices support realistic planning.
                                    </p>
                                </div>
                                <div className="rounded-3xl border border-border bg-surface-sunken p-5">
                                    <Users className="h-5 w-5 text-cyan-600 dark:text-cyan-300" />
                                    <h3 className="mt-4 text-lg font-semibold text-content">Community ready</h3>
                                    <p className="mt-2 text-sm leading-6 text-content/65">
                                        Public content, sharing and private copies work together naturally.
                                    </p>
                                </div>
                                <div className="rounded-3xl border border-border bg-surface-sunken p-5">
                                    <Target className="h-5 w-5 text-fuchsia-600 dark:text-fuchsia-300" />
                                    <h3 className="mt-4 text-lg font-semibold text-content">Goal driven</h3>
                                    <p className="mt-2 text-sm leading-6 text-content/65">
                                        Logging intake closes the loop between plan and execution.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* Community section */}
                    <motion.section
                        variants={sectionFade}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <SectionHeader
                            eyebrow="Community"
                            title="Eating healthier together"
                            text="BalanceBite is not just a personal tool — it is a platform where people inspire each other."
                        />

                        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
                            <div className="rounded-[28px] border border-content/10 bg-surface p-6 md:p-8">
                                <Users className="h-8 w-8 text-cyan-600 dark:text-cyan-300" />
                                <h3 className="mt-5 text-2xl font-semibold tracking-tight text-content">
                                    Share meals, copy plans
                                </h3>
                                <p className="mt-3 text-sm leading-7 text-content/65 md:text-base">
                                    Anyone can share meals and diet plans publicly. See something that appeals to you?
                                    Copy it to your profile and adapt it to your situation — without changing the original.
                                    Learn from others without reinventing the wheel.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => navigate("/meals")}
                                    className="mt-6 inline-flex items-center gap-2 rounded-full border border-content/15 bg-content/5 px-4 py-2 text-sm font-medium text-content/80 transition hover:bg-content/10 hover:text-content"
                                >
                                    Explore meals <ArrowRight className="h-4 w-4" />
                                </button>
                            </div>

                            <div className="rounded-[28px] border border-content/10 bg-surface p-6 md:p-8">
                                <ChefHat className="h-8 w-8 text-emerald-600 dark:text-emerald-300" />
                                <h3 className="mt-5 text-2xl font-semibold tracking-tight text-content">
                                    Your knowledge is valuable
                                </h3>
                                <p className="mt-3 text-sm leading-7 text-content/65 md:text-base">
                                    Do you know how to cook cheap and healthy? Share your recipes and help others
                                    who are just starting out. Or are you the one looking for inspiration? There is always
                                    someone in the community with something to offer — from budget meals to
                                    high-protein diet plans.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => navigate("/create-meal")}
                                    className="mt-6 inline-flex items-center gap-2 rounded-full border border-content/15 bg-content/5 px-4 py-2 text-sm font-medium text-content/80 transition hover:bg-content/10 hover:text-content"
                                >
                                    Create a meal <ArrowRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </motion.section>

                    {/* Vendor / partner section */}
                    <motion.section
                        variants={sectionFade}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <div className="overflow-hidden rounded-[34px] border border-content/10 bg-gradient-to-r from-emerald-400/15 via-cyan-400/10 to-fuchsia-400/15 p-8 shadow-2xl backdrop-blur-xl md:p-10">
                            <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                                <div>
                                    <span className="mb-4 inline-flex rounded-full border border-content/15 bg-content/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-content/85">
                                        For vendors & partners
                                    </span>
                                    <h2 className="text-3xl font-semibold tracking-tight text-content md:text-4xl">
                                        Making a real difference together.
                                    </h2>
                                    <p className="mt-4 max-w-2xl text-sm leading-7 text-content/75 md:text-base">
                                        We believe that eating healthy and affordably is not just a personal choice —
                                        it is also an opportunity for vendors and brands to deliver genuine value.
                                        BalanceBite offers the ability to put products and meals in front of people
                                        who are actively looking for them.
                                    </p>
                                    <p className="mt-3 max-w-2xl text-sm leading-7 text-content/75 md:text-base">
                                        Are you a local producer, an online shop or a food brand?
                                        We are open to collaboration. Let us build together a platform
                                        that helps people eat better, without forgetting their budget.
                                    </p>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="rounded-3xl border border-border bg-surface-sunken p-5 backdrop-blur">
                                        <Handshake className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                                        <p className="mt-3 text-lg font-semibold text-content">
                                            Reach motivated users
                                        </p>
                                        <p className="mt-1 text-sm text-content/55">
                                            People who are actively focused on nutrition and reaching their goals.
                                        </p>
                                    </div>
                                    <div className="rounded-3xl border border-border bg-surface-sunken p-5 backdrop-blur">
                                        <ShoppingCart className="h-5 w-5 text-cyan-600 dark:text-cyan-300" />
                                        <p className="mt-3 text-lg font-semibold text-content">
                                            Contextually visible
                                        </p>
                                        <p className="mt-1 text-sm text-content/55">
                                            Products shown at the moment users are planning meals and doing their shopping.
                                        </p>
                                    </div>
                                    <div className="rounded-3xl border border-border bg-surface-sunken p-5 backdrop-blur sm:col-span-2">
                                        <Target className="h-5 w-5 text-fuchsia-600 dark:text-fuchsia-300" />
                                        <p className="mt-3 text-lg font-semibold text-content">
                                            A shared goal
                                        </p>
                                        <p className="mt-1 text-sm text-content/55">
                                            Not advertising for advertising's sake — but genuinely helping people
                                            eat healthier and more affordably together.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* Final CTA */}
                    <motion.section
                        variants={sectionFade}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <div className="rounded-[34px] border border-content/10 bg-surface p-8 text-center shadow-xl md:p-12">
                            <span className="mb-4 inline-flex rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200">
                                Start today
                            </span>
                            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-content md:text-4xl">
                                Your nutrition, your budget, your goals.
                            </h2>
                            <p className="mt-4 mx-auto max-w-xl text-sm leading-7 text-content/65 md:text-base">
                                Whether you want to lose weight, build muscle or simply eat more consciously —
                                BalanceBite gives you the tools to actually do it.
                            </p>
                            <div className="mt-8 flex flex-wrap justify-center gap-4">
                                <button
                                    type="button"
                                    onClick={() => navigate("/meals")}
                                    className="inline-flex items-center gap-2 rounded-full bg-content px-6 py-3 text-sm font-semibold text-page transition hover:scale-[1.02]"
                                >
                                    Explore meals
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate("/create-meal")}
                                    className="inline-flex items-center gap-2 rounded-full border border-content/15 bg-content/5 px-6 py-3 text-sm font-semibold text-content transition hover:bg-content/10"
                                >
                                    Create a meal
                                    <ChefHat className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </motion.section>

                </main>
            </PageWrapper>
        </div>
    );
}
