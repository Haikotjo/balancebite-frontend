import { useState } from "react";
import {inviteClientApi} from "../../../services/apiService.js";
import CreateMealAsDietitianForm from "../components/CreateMealAsDietitianForm.jsx";


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
        <div className="max-w-md mx-auto p-4">
            <h1 className="text-xl font-bold mb-4">Koppel een cliënt</h1>
            <form onSubmit={handleInvite} className="space-y-4">
                <input
                    type="email"
                    className="w-full p-2 border rounded"
                    placeholder="Emailadres cliënt"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                >
                    Verstuur uitnodiging
                </button>
            </form>
            {message && <p className="mt-4 text-green-600">{message}</p>}
            {error && <p className="mt-4 text-red-600">{error}</p>}
            <div className="mt-12">
                <CreateMealAsDietitianForm/>
            </div>

        </div>
    );
};

export default DietitianPage;
