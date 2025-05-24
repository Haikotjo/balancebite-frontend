import { useContext, useEffect } from "react";
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
        sortKey,
        setSortKey,
        sortOrder,
        setSortOrder,
    } = useContext(UserDietsContext);

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const handleSort = (field) => {
        const isSameField = sortKey === field;
        const newOrder = isSameField && sortOrder === "asc" ? "desc" : "asc";

        setSortKey(field);
        setSortOrder(newOrder);

        console.log(`[🔀 SORT] Sorting by ${field} (${newOrder})`);
    };


    // Pas activeOption aan op basis van zoekparams
    useEffect(() => {
        const filterParam = searchParams.get("filter");
        if (filterParam) {
            setActiveOption(filterParam);
        }
    }, [searchParams, setActiveOption]);

    // Trigger data ophalen bij load of verandering
    useEffect(() => {
        fetchDietsData();
    }, [activeOption, page, sortKey, sortOrder, fetchDietsData]);

    // Log gesorteerde waarden
    useEffect(() => {
        if (diets && diets.length > 0) {
            const top = diets.slice(0, 5).map(diet => ({
                name: diet.name,
                value: diet[sortKey],
            }));
            console.log("🔍 Top 5 sorted diets:", top);
        }
    }, [diets, sortKey]);

    return (
        <CustomBox className="pt-6 sm:pt-10 px-4 pb-20 sm:pb-10">
            <SubMenu />

            <CustomBox className="flex gap-2 mb-4 flex-wrap">
                {[
                    { label: "Protein (avg)", field: "avgProtein" },
                    { label: "Carbs (avg)", field: "avgCarbs" },
                    { label: "Fat (avg)", field: "avgFat" },
                    { label: "Calories (avg)", field: "avgCalories" },
                    { label: "Protein (total)", field: "totalProtein" },
                    { label: "Carbs (total)", field: "totalCarbs" },
                    { label: "Fat (total)", field: "totalFat" },
                    { label: "Calories (total)", field: "totalCalories" },
                ].map(({ label, field }) => (
                    <button
                        key={field}
                        onClick={() => handleSort(field)}
                        className={`px-3 py-1 border rounded ${
                            sortKey === field ? "bg-blue-600 text-white" : "bg-gray-200"
                        }`}
                    >
                        {label} {sortKey === field ? (sortOrder === "asc" ? "↑" : "↓") : ""}
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

            <ScrollToTopButton />
        </CustomBox>
    );
};

export default DietsPage;