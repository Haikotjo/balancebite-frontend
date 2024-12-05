import { Link } from "react-router-dom";

function Navigation() {
    return (
        <nav>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/meals">Meals</Link>
            <Link to="/login">Login</Link>
        </nav>
    );
}

export default Navigation;

