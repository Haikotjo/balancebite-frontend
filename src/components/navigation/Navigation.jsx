import { Link } from "react-router-dom";

function Navigation() {
    return (
        <nav>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/meals">Meals</Link>
        </nav>
    );
}

export default Navigation;
