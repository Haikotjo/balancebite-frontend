import { useContext, useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import ScrollToTopButton from "../../../../components/scrollToTopButton/ScrollToTopButton.jsx";
import DietsList from "../../components/dietsList/DietsList.jsx";
import { UserDietsContext } from "../../../../context/UserDietContext.jsx";
import SubMenu from "../../components/subMenu/SubMenu.jsx";

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

    // Zorg dat submenu reageert op zoekparams (zoals ?filter=My Diets)
    useEffect(() => {
        const filterParam = searchParams.get("filter");
        if (filterParam) {
            setActiveOption(filterParam);
        }
    }, [searchParams, setActiveOption]);

    useEffect(() => {
        console.log("📦 diets binnengehaald uit context:", diets);
        console.log("⏳ loading:", loading);
        console.log("❌ error:", error);
        console.log("📄 activeOption:", activeOption);
        console.log("📃 pagina:", page, "/", totalPages);
    }, [diets, loading, error, activeOption, page, totalPages]);


    return (
        <CustomBox className="mt-10 p-4">
            <CustomTypography variant="h1" className="mb-4">
                {activeOption}
            </CustomTypography>

            <SubMenu />

            {error && <p className="text-red-500">Fout bij ophalen: {error}</p>}
            {loading ? (
                <p>Loading...</p>
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
