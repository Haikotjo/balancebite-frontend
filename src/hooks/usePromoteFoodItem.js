// src/hooks/usePromoteFoodItem.js
import { useState } from "react";
import { createPromotionApi } from "../services/apiService";
import { getAccessToken } from "../utils/helpers/getAccessToken";

export const usePromoteFoodItem = () => {
    const [loading, setLoading] = useState(false);

    const submit = async ({
                              foodItemId,
                              startDate,      // "YYYY-MM-DD"
                              endDate,        // "YYYY-MM-DD" | ""
                              promoPrice,     // string/number | ""
                              salePercentage, // string/number | ""
                              saleDescription // string | ""
                          }) => {
        if (!foodItemId || !startDate) throw new Error("Select item en startdatum.");
        const hasPromo = promoPrice !== "" && promoPrice != null;
        const hasPct   = salePercentage !== "" && salePercentage != null;
        if (hasPromo === hasPct) throw new Error("Geef óf promoPrice óf salePercentage (exact één).");

        const pct = hasPct ? parseInt(salePercentage, 10) : null;
        if (pct != null && (isNaN(pct) || pct < 0 || pct > 100)) {
            throw new Error("salePercentage moet tussen 0 en 100 zijn.");
        }

        const body = {
            foodItemId: Number(foodItemId),
            startDate: `${startDate}T00:00:00`,
            endDate: endDate ? `${endDate}T23:59:59` : null, // laat weg = backend default 7 dagen
            promoPrice: hasPromo ? parseFloat(promoPrice) : null,
            salePercentage: pct,
            saleDescription: (saleDescription ?? "").trim() || null,
        };

        setLoading(true);
        try {
            const token = getAccessToken();
            return await createPromotionApi(body, token);
        } finally {
            setLoading(false);
        }
    };

    return { submit, loading };
};
