import { useEffect, useState } from "react";

/**
 * Custom hook to fetch the user profile data based on a JWT token.
 * Automatically decodes the token, fetches the profile, and handles loading/error states.
 *
 * @param {string} token - JWT access token.
 * @param {function} decodeToken - Function to decode the token and extract user information.
 * @param {function} fetchUserProfile - API function to fetch the user profile.
 * @returns {object|null|undefined} - The user profile object, null if not found, or undefined while loading.
 */
export const useFetchUserProfileData = (token, decodeToken, fetchUserProfile) => {
    const [userProfile, setUserProfile] = useState(undefined);

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
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
                setUserProfile(null);
            }
        };

        fetchData();
    }, [token, decodeToken, fetchUserProfile]);

    return userProfile;
};
