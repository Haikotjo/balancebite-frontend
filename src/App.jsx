import AppRoutes from "./routes/Routes.jsx";
import { BookOpen, Soup, UserPen } from "lucide-react";

function App() {
    console.log("🚀 VITE_BASE_URL =", import.meta.env.VITE_BASE_URL);
    return (
        <>
        <div style={{display: "none"}}>
            <BookOpen/>
            <Soup/>
            <UserPen/>
        </div>

    <AppRoutes/>
</>
)
    ;
}

export default App;
