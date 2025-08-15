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
import {getAllPublicDietPlanNames, getStickyItems, searchUsersApi} from "../../../../services/apiService.js";
import {useLocation} from "react-router-dom";
import SearchBar from "../../../../components/searchBar/SearchBar.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import PageWrapper from "../../../../components/layout/PageWrapper.js";

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
    const filtersActive = Object.keys(filters).length > 0 || creatorIdFilter;


    const handleCombinedSearch = async (query) => {
        const [diets, users] = await Promise.all([
            getAllPublicDietPlanNames(),
            searchUsersApi(query),
        ]);

        const dietOptions = diets
            .filter(d => d.name.toLowerCase().includes(query.toLowerCase()))
            .map(d => ({ type: "diet", id: d.id, name: d.name }));

        const userOptions = users.map(u => ({ type: "user", id: u.id, name: u.userName }));

        return [...dietOptions, ...userOptions];
    };


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
        <PageWrapper >

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

            <CustomBox className="w-[300px] md:w-[350px] my-6 mx-auto">
                <SearchBar
                    onSearch={handleCombinedSearch}
                    onQuerySubmit={(val) => {
                        if (typeof val === "string") {
                            setFilters((prev) => ({ ...prev, name: val }));
                            setCreatorIdFilter(null);
                        } else if (val.creatorId) {
                            setCreatorIdFilter(val.creatorId);
                            setFilters((prev) => {
                                // eslint-disable-next-line no-unused-vars
                                const { name, ...rest } = prev;
                                return rest;
                            });
                        }
                        setPage(1);
                    }}

                />
            </CustomBox>


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
            ) : diets.length === 0 ? (
                filtersActive ? (
                    <CustomTypography
                        variant="paragraph"
                        color="text-gray-500"
                        italic
                        className="text-center mt-10"
                    >
                        No diet plans found matching your filters.
                    </CustomTypography>
                ) : (
                    <CustomTypography
                        variant="paragraph"
                        color="text-gray-500"
                        italic
                        className="text-center mt-10"
                    >
                        No public diet plans available yet.
                    </CustomTypography>
                )
            ) : (
                <DietsList diets={diets} pinnedDiets={pinnedDiets} />
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
        </PageWrapper >

    );
};

export default DietsPage;
