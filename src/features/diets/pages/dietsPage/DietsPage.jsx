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
import SortControls from "../../components/sortControls/SortControls.jsx";
import DietsPageChip from "../../components/dietsPageChip/DietsPageChip.jsx";
import DietsFilterChip from "../../components/DietsFilterChip.jsx";
import NutrientRangeChips from "../../components/nutrientRangeChips/NutrientRangeChips.jsx";

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
        filters,
        setFilters,
        creatorIdFilter,
        setCreatorIdFilter,
    } = useContext(UserDietsContext);

    const [showErrorDialog, setShowErrorDialog] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const creatorName = creatorIdFilter
        ? diets.find(d => d.createdBy?.id === creatorIdFilter)?.createdBy?.userName || "Creator"
        : null;

    useEffect(() => {
        const filterParam = searchParams.get("filter");
        if (filterParam) setActiveOption(filterParam);
    }, [searchParams, setActiveOption]);

    useEffect(() => {
        setPage(1);
    }, [sortKey, sortOrder]);

    useEffect(() => {
        if (error) setShowErrorDialog(true);
    }, [error]);

    return (
        <CustomBox className="pt-6 sm:pt-10 px-4 pb-20 sm:pb-10">
            <SubMenu />

            {(Object.keys(filters).length > 0 || creatorIdFilter || sortKey !== "name" || sortOrder !== "asc") && (
                <CustomBox className="mb-4 flex flex-wrap gap-2 items-center">
                    <span className="font-semibold">Active filters:</span>

                    {(Object.keys(filters).length + (creatorIdFilter ? 1 : 0) + ((sortKey !== "name" || sortOrder !== "asc") ? 1 : 0)) > 0 && (
                        <DietsFilterChip
                            label="Clear all"
                            colorClass="text-red-600"
                            onRemove={() => {
                                setFilters({});
                                setCreatorIdFilter(null);
                                setSortKey("name");
                                setSortOrder("asc");
                            }}
                        />
                    )}

                    {(sortKey !== "name" || sortOrder !== "asc") && (
                        <DietsFilterChip
                            label={`Sort: ${sortKey} (${sortOrder})`}
                            colorClass="text-yellow-600"
                            onRemove={() => {
                                setSortKey("name");
                                setSortOrder("asc");
                            }}
                        />
                    )}

                    {creatorIdFilter && creatorName && (
                        <DietsFilterChip
                            label={creatorName}
                            colorClass="text-green-600"
                            onRemove={() => setCreatorIdFilter(null)}
                        />
                    )}

                    <NutrientRangeChips filters={filters} setFilters={setFilters} />

                </CustomBox>
            )}

            <SortControls
                sortKey={sortKey}
                sortOrder={sortOrder}
                onSortChange={(field, order) => {
                    setSortKey(field);
                    setSortOrder(order);
                }}
                filters={filters}
                setFilters={setFilters}
            />

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
