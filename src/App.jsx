import AppRoutes from "./routes/Routes.jsx";
import CustomBox from "./components/layout/CustomBox.jsx";

function App() {
    return (
        <CustomBox className="min-h-screen bg-lightBackground dark:bg-darkBackground text-lightText dark:text-darkText">
            <AppRoutes />
        </CustomBox>
    );
}

export default App;
