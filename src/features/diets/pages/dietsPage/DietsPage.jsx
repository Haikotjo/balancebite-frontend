import { useContext, useEffect, useState } from "react";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import { UserDietsContext } from "../../../../context/UserDietContext.jsx";
import ScrollToTopButton from "../../../../components/scrollToTopButton/ScrollToTopButton.jsx";
import DietsList from "../../components/dietsList/DietsList.jsx";
import DietSubMenu from "../../components/subMenu/DietsSubMenu.jsx";
import Spinner from "../../../../components/layout/Spinner.jsx";
import CustomPagination from "../../../../components/customPagination/CustomPagination.jsx";
import ErrorDialog from "../../../../components/layout/ErrorDialog.jsx";
import SortControls from "../../components/sortControls/SortControls.jsx";
import ActiveFilterChips from "../../components/activeFilterChips/ActiveFilterChips.jsx";
import fetchStickyItemDetails from "../../../../utils/helpers/fetchStickyItemDetails.js";
import {getStickyItems} from "../../../../services/apiService.js";
import {useLocation} from "react-router-dom";

const DietsPage = () => {
    const {
        diets,
        loading,
        error,
        page,
        setPage,
        totalPages,
        sortKey,
        setSortKey,
        sortOrder,
        setSortOrder,
        filters,
        setFilters,
        creatorIdFilter,
        setCreatorIdFilter,
        setActiveOption,
        activeOption,
    } = useContext(UserDietsContext);

    const [showErrorDialog, setShowErrorDialog] = useState(false);
    const [creatorName, setCreatorName] = useState(null);
    const location = useLocation();
    const [pinnedDiets, setPinnedDiets] = useState([]);

    useEffect(() => {
        if (creatorIdFilter) {
            const match = diets.find((d) => d.createdBy?.id === creatorIdFilter);
            setCreatorName(match ? match.createdBy.userName : null);
        } else {
            setCreatorName(null);
        }
    }, [creatorIdFilter, diets]);

    useEffect(() => {
        setPage(1);
    }, [sortKey, sortOrder]);


    useEffect(() => {
        if (error) setShowErrorDialog(true);
    }, [error]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const option = params.get("option");
        if (option) {
            const formatted = option
                .split("-")
                .map((s, i) =>
                    i === 0 ? s.charAt(0).toUpperCase() + s.slice(1) : s
                )
                .join(" ");
            setActiveOption(formatted);
        }
    }, [location.search, setActiveOption]);

    useEffect(() => {
        const shouldLoadPinned =
            activeOption === "All Diets" &&
            !creatorIdFilter &&
            Object.keys(filters).length === 0 &&
            !sortKey;

        if (!shouldLoadPinned) {
            setPinnedDiets([]);
            return;
        }

        const loadPinnedDiets = async () => {
            try {
                const stickyItems = await getStickyItems();
                const { diets } = await fetchStickyItemDetails(stickyItems);
                setPinnedDiets(diets.length > 0 ? [diets[0]] : []);
            } catch (err) {
                console.error("❌ Failed to load pinned diets", err);
            }
        };

        loadPinnedDiets();
    }, [filters, sortKey, creatorIdFilter, activeOption]);


    return (
        <CustomBox className="pt-6 sm:pt-10 px-4 pb-24 sm:pb-10">
            <DietSubMenu
                isDetailPage={false}
                onSelect={() => {
                }}
            />

            <SortControls
                className="mt-6"
                sortKey={sortKey}
                sortOrder={sortOrder}
                onSortChange={(field, order) => {
                    setSortKey(field);
                    setSortOrder(order);
                }}
                filters={filters}
                setFilters={setFilters}
            />

            <ActiveFilterChips
                filters={filters}
                setFilters={setFilters}
                creatorIdFilter={creatorIdFilter?.toString() ?? null}
                setCreatorIdFilter={setCreatorIdFilter}
                creatorName={creatorName}
                sortKey={sortKey}
                setSortKey={setSortKey}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
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
                    pinnedDiets={pinnedDiets}
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
