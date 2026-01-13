import { useState, useEffect } from "react";
import { fetchUserProfile } from "../../../../services/apiService.js";

const useFetchProfile = (token, reset) => {
    const [initialValues, setInitialValues] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            if (!token) return;
            try {
                const result = await fetchUserProfile(token);
                if (isMounted) {
                    const values = {
                        username: result.userName,
                        email: result.email,
                    };
                    setInitialValues(values);
                    if (reset) reset(values);
                }
            } catch (err) {
                console.error("Failed to fetch user details:", err);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        void loadData();
        return () => { isMounted = false; };
    }, [token, reset]);

    return { initialValues, setInitialValues, isLoading };
};

export default useFetchProfile;