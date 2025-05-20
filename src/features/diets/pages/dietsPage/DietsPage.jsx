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

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // // Zorg dat submenu reageert op zoekparams (zoals ?filter=My Diets)
    // useEffect(() => {
    //     const filterParam = searchParams.get("filter");
    //     if (filterParam) {
    //         setActiveOption(filterParam);
    //     }
    // }, [searchParams, setActiveOption]);

    return (
        <CustomBox className="mt-10 p-4">

            <SubMenu />

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
