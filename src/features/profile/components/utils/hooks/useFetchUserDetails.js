import { useEffect, useState } from "react";
import {fetchUserProfile} from "../../../../../services/apiService.js";


const useFetchUserDetails = (token) => {
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchUserProfile(token);
                setUserDetails(data);
            } catch (err) {
                setError("Failed to fetch user details.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchData();
    }, [token]);

    return { userDetails, loading, error, setUserDetails };
};

export default useFetchUserDetails;
