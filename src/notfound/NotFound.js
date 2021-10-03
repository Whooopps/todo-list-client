import { Link } from "react-router-dom";

function NotFound() {
    return (
        <div>
            Page you were looking for was not found.
            <Link to="/">Go to Home</Link>
        </div>
    );
}
export default NotFound;