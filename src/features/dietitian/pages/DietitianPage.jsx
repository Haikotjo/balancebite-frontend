import { useState } from "react";
import {inviteClientApi} from "../../../services/apiService.js";
import CreateMealAsDietitianForm from "../components/CreateMealAsDietitianForm.jsx";
import CreateDietFormAsDietitian from "../components/CreateDietFormAsDietitian.jsx";
import CustomBox from "../../../components/layout/CustomBox.jsx";
import CustomCard from "../../../components/layout/CustomCard.jsx";
import CustomTypography from "../../../components/layout/CustomTypography.jsx";
import PageWrapper from "../../../components/layout/PageWrapper.jsx";


const DietitianPage = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleInvite = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);
        try {
            const result = await inviteClientApi(email);
            setMessage(`Uitnodiging verstuurd naar ${email}.`);
            setEmail("");
        } catch (err) {
            setError("Er is iets misgegaan bij het versturen.");
        }
    };

    return (
        <PageWrapper>
            {/* Center content and constrain width */}
            <CustomBox className="max-w-screen-lg mx-auto flex flex-col gap-8">
                {/* Invite client */}
                <CustomCard className="p-4">
                    <CustomTypography as="h1" className="text-xl font-bold mb-4">
                        Koppel een cliënt
                    </CustomTypography>

                    <form onSubmit={handleInvite} className="space-y-4">
                        {/* Email input */}
                        <input
                            type="email"
                            className="w-full p-2 border rounded"
                            placeholder="Emailadres cliënt"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            aria-label="Client email"
                        />

                        {/* Submit */}
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                        >
                            Verstuur uitnodiging
                        </button>
                    </form>

                    {/* Feedback messages */}
                    {message && <p className="mt-4 text-green-600">{message}</p>}
                    {error && <p className="mt-4 text-red-600">{error}</p>}
                </CustomCard>

                {/* Dietitian tools: create meal/diet */}
                <CustomBox className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <CustomCard className="p-4">
                        {/* Build meal specifically as dietitian */}
                        <CreateMealAsDietitianForm />
                    </CustomCard>

                    <CustomCard className="p-4">
                        {/* Build diet specifically as dietitian */}
                        <CreateDietFormAsDietitian />
                    </CustomCard>
                </CustomBox>
            </CustomBox>
        </PageWrapper>
    );
};

export default DietitianPage;