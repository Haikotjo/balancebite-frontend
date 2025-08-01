import AppRoutes from "./routes/Routes.jsx";

function App() {
    console.log("🚀 VITE_BASE_URL =", import.meta.env.VITE_BASE_URL);
    return (
        <AppRoutes/>
    );
}
export default App;
