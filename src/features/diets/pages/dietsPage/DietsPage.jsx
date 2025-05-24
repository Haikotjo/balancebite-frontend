import {useContext, useEffect, useState} from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import { UserDietsContext } from "../../../../context/UserDietContext.jsx";
import ScrollToTopButton from "../../../../components/scrollToTopButton/ScrollToTopButton.jsx";
import DietsList from "../../components/dietsList/DietsList.jsx";
import SubMenu from "../../components/subMenu/SubMenu.jsx";
import Spinner from "../../../../components/layout/Spinner.jsx";
import CustomPagination from "../../../../components/customPagination/CustomPagination.jsx";
import ErrorDialog from "../../../../components/layout/ErrorDialog.jsx";

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

    const {
        // ...bestaande props
        filters,
        setFilters,
        creatorIdFilter,
        setCreatorIdFilter,
    } = useContext(UserDietsContext);


    const [showErrorDialog, setShowErrorDialog] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const handleSort = (field) => {
        const isSameField = sortKey === field;
        const newOrder = isSameField && sortOrder === "asc" ? "desc" : "asc";

        setSortKey(field);
        setSortOrder(newOrder);
    };

    // Pas activeOption aan op basis van zoekparams
    useEffect(() => {
        const filterParam = searchParams.get("filter");
        if (filterParam) {
            setActiveOption(filterParam);
        }
    }, [searchParams, setActiveOption]);


    useEffect(() => {
        setPage(1);
    }, [sortKey, sortOrder]);

    useEffect(() => {
        if (error) {
            setShowErrorDialog(true);
        }
    }, [error]);

    return (
        <CustomBox className="pt-6 sm:pt-10 px-4 pb-20 sm:pb-10">
            <SubMenu />
            {(Object.keys(filters).length > 0 || creatorIdFilter || sortKey !== "name" || sortOrder !== "asc") && (
                <CustomBox className="mb-4 flex flex-wrap gap-2 items-center">
                    <span className="font-semibold">Active filters:</span>

                    {/* Macro-filters */}
                    {(sortKey !== "name" || sortOrder !== "asc") && (
                        <button
                            onClick={() => {
                                setSortKey("name");
                                setSortOrder("asc");
                            }}
                            className="px-2 py-1 text-sm rounded bg-yellow-100 hover:bg-yellow-200 text-yellow-800"
                        >
                            Sort: {sortKey} ({sortOrder}) ✕
                        </button>
                    )}

                    {/* Creator filter */}
                    {creatorIdFilter && (
                        <button
                            onClick={() => setCreatorIdFilter(null)}
                            className="px-2 py-1 text-sm rounded bg-green-100 hover:bg-green-200 text-green-800"
                        >
                            Creator ✕
                        </button>
                    )}
                    <button
                        onClick={() => {
                            setFilters({});
                            setCreatorIdFilter(null);
                            setSortKey("name");
                            setSortOrder("asc");
                        }}
                        className="px-2 py-1 text-sm rounded bg-red-100 hover:bg-red-200 text-red-800 ml-2"
                    >
                        Clear all ✕
                    </button>

                </CustomBox>
            )}

            <CustomBox className="flex gap-2 mb-4 flex-wrap">
                {[
                    {label: "Protein (avg)", field: "avgProtein"},
                    {label: "Carbs (avg)", field: "avgCarbs"},
                    {label: "Fat (avg)", field: "avgFat" },
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

            <ErrorDialog
                open={showErrorDialog}
                onClose={() => setShowErrorDialog(false)}
                message={`Unable to load diets: ${error}`}
                type="error"
            />


            {loading ? (
                <Spinner className="mx-auto my-10" />
            ) : (
                <DietsList
                    diets={diets}
                    onItemClick={(id) => navigate(`/diet/${id}`)}
                />
            )}

            {totalPages > 1 && (
                <CustomBox className="mt-2 mb-20 sm:mb-8">
                    <CustomPagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={(newPage) => setPage(newPage)}
                    />
                </CustomBox>
            )}
            <ScrollToTopButton />
        </CustomBox>
    );
};

export default DietsPage;