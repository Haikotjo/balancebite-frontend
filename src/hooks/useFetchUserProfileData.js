import { useEffect, useState } from "react";

export const useFetchUserProfileData = (token, decodeToken, fetchUserProfile, reset) => {
    const [userProfile, setUserProfile] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!token) {
                console.warn("No token found.");
                setUserProfile(null);
                return;
            }

            const userId = decodeToken(token);

            if (!userId) {
                console.warn("User ID (sub) is missing from the token.");
                setUserProfile(null);
                return;
            }

            try {
                const data = await fetchUserProfile(token);
                if (!data) {
                    console.warn("No user profile found.");
                    setUserProfile(null);
                } else {
                    setUserProfile(data);
                    reset(data);
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
                setUserProfile(null);
            }
        };

        fetchData();
    }, [token, decodeToken, fetchUserProfile, reset]);

    return userProfile;
};
