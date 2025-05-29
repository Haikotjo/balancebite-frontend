import {useContext, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import { UserDietsContext } from "../../../../context/UserDietContext.jsx";
import ScrollToTopButton from "../../../../components/scrollToTopButton/ScrollToTopButton.jsx";
import DietsList from "../../components/dietsList/DietsList.jsx";
import SubMenu from "../../components/subMenu/SubMenu.jsx";
import Spinner from "../../../../components/layout/Spinner.jsx";
import CustomPagination from "../../../../components/customPagination/CustomPagination.jsx";
import ErrorDialog from "../../../../components/layout/ErrorDialog.jsx";
import SortControls from "../../components/sortControls/SortControls.jsx";
import ActiveFilterChips from "../../components/activeFilterChips/ActiveFilterChips.jsx";

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
    } = useContext(UserDietsContext);

    const [showErrorDialog, setShowErrorDialog] = useState(false);
    const navigate = useNavigate();
    const [creatorName, setCreatorName] = useState(null);

    useEffect(() => {
        if (creatorIdFilter) {
            const match = diets.find(d => d.createdBy?.id === creatorIdFilter);
            if (match) {
                setCreatorName(match.createdBy.userName);
            }
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

    return (
        <CustomBox className="pt-6 sm:pt-10 px-4 pb-20 sm:pb-10">
            <SubMenu />

            <ActiveFilterChips
                filters={filters}
                setFilters={setFilters}
                creatorIdFilter={creatorIdFilter}
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
