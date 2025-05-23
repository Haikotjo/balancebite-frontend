import { useContext, useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import { UserDietsContext } from "../../../../context/UserDietContext.jsx";
import ScrollToTopButton from "../../../../components/scrollToTopButton/ScrollToTopButton.jsx";
import DietsList from "../../components/dietsList/DietsList.jsx";
import SubMenu from "../../components/subMenu/SubMenu.jsx";
import Spinner from "../../../../components/layout/Spinner.jsx";

const DietsPage = () => {
    const {
        diets,
        loading,
        error,
        activeOption,
        setActiveOption,
        page,
        setPage,
        totalPages,
        fetchDietsData,
    } = useContext(UserDietsContext);
    const { sortKey, setSortKey, sortOrder, setSortOrder } = useContext(UserDietsContext);

    const handleSort = (field) => {
        let newOrder = "desc";
        if (sortKey === field) {
            newOrder = sortOrder === "asc" ? "desc" : "asc";
            setSortOrder(newOrder);
        } else {
            setSortKey(field);
            setSortOrder("desc");
        }

        console.log(`[Sort] Sorting by: ${field}, Order: ${sortKey === field ? newOrder : "desc"}`);
    };

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Zorg dat submenu reageert op zoekparams (zoals ?filter=My Diets)
    useEffect(() => {
        const filterParam = searchParams.get("filter");
        if (filterParam) {
            setActiveOption(filterParam);
        }
    }, [searchParams, setActiveOption]);

    useEffect(() => {
        console.log(`[Fetch] Triggered by sort change → sortBy: ${sortKey }, sortOrder: ${sortOrder}`);
        fetchDietsData();
    }, [sortKey , sortOrder]);

    useEffect(() => {
        if (diets && diets.length > 0) {
            console.log("[DietsPage] Gemiddelde waarden van huidige diets op pagina:");
            diets.forEach((diet) => {
                console.log(`- ${diet.name} → Calories: ${diet.avgCalories}, Protein: ${diet.avgProtein}, Carbs: ${diet.avgCarbs}, Fat: ${diet.avgFat}`);
            });
        } else {
            console.log("[DietsPage] Geen diets beschikbaar op deze pagina.");
        }
    }, [diets]);



    return (
        <CustomBox className="pt-6 sm:pt-10 px-4 pb-20 sm:pb-10">

        <SubMenu />
            <CustomBox className="flex gap-2 mb-4 flex-wrap">
                {[
                    { label: "Protein", field: "avgProtein" },
                    { label: "Carbs", field: "avgCarbs" },
                    { label: "Fat", field: "avgFat" },
                    { label: "Calories", field: "avgCalories" },
                ].map(({ label, field }) => (
                    <button
                        key={field}
                        onClick={() => handleSort(field)}
                        className={`px-3 py-1 border rounded ${
                            sortKey  === field ? "bg-blue-600 text-white" : "bg-gray-200"
                        }`}
                    >
                        {label} {sortKey  === field ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                    </button>
                ))}
            </CustomBox>

            {error && <p className="text-red-500">Fout bij ophalen: {error}</p>}
            {loading ? (
                <Spinner className="mx-auto my-10" />
            ) : (
                <DietsList
                    diets={diets}
                    onItemClick={(id) => navigate(`/diet/${id}`)}
                />
            )}

            {/* Scroll button */}
            <ScrollToTopButton />
        </CustomBox>
    );
};

export default DietsPage;
