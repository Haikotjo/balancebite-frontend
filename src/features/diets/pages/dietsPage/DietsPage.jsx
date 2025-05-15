// src/features/diets/pages/dietsPage/DietsPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import { getAllPublicDietPlansApi } from "../../../../services/apiService.js";
import DietsList from "../../components/dietsList/DietsList.jsx";

/**
 * Eenvoudige lijstweergave van alle publieke diet-plannen.
 */
const DietsPage = () => {
    const [diets, setDiets] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getAllPublicDietPlansApi({ page: 0, size: 20 })
            .then((data) => setDiets(data))
            .catch((err) => console.error("Fout bij ophalen diet-plannen:", err));
    }, []);

    return (
        <CustomBox className="mt-10 p-4">
            <CustomTypography variant="h1" className="mb-4">
                All Public Diet Plans
            </CustomTypography>
            <DietsList
                diets={diets}
                onItemClick={(id) => navigate(`/diet/${id}`)}
            />
        </CustomBox>
    );
};

export default DietsPage;