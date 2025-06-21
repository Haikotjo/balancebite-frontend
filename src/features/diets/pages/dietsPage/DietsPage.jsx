import { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import DietModal from "../../components/dietmodal/DietModal.jsx";


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
    const navigate = useNavigate();
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
        console.log("Sorting changed:", { sortKey, sortOrder });
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

    // DEBUG ONLY – logging effects (verwijderen voor productie)
    useEffect(() => {
        console.log("Page changed:", page);
    }, [page]);


    useEffect(() => {
        console.log("Diets list updated (after filters/sorting):", diets);
    }, [diets]);

    useEffect(() => {
        console.log("Filters changed:", filters);
    }, [filters]);

    useEffect(() => {
        console.log("Creator ID filter changed:", creatorIdFilter);
    }, [creatorIdFilter]);

    useEffect(() => {
        if (!diets || diets.length === 0) return;

        console.log(`Diets sorted by ${sortKey} (${sortOrder}):`);
        diets.forEach((diet, index) => {
            const value = sortKey === 'name'
                ? diet.name
                : diet[sortKey]; // werkt alleen als sortKey direct op diet zit

            // Voor nested velden zoals macros
            const macroValue = diet?.averageMacros?.[sortKey];

            console.log(`${index + 1}. ${diet.name} - ${macroValue ?? value ?? "?"}`);
        });
    }, [diets, sortKey, sortOrder]);




    return (
        <CustomBox className="pt-6 sm:pt-10 px-4 pb-24 sm:pb-10">
            <DietSubMenu
                isDetailPage={false}
                onSelect={() => {
                }}
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
