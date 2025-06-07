import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { clearUsername } from "../features/users/userSlice";

function NavBar() {
    const username = useSelector((state) => state.user.name);
    const dispatch = useDispatch()

    const handleLogout = () => {
        localStorage.clear();
        dispatch(clearUsername());
    }
    return (
        <div className="absolute top-0 h-[10%] w-screen bg-amber-50 flex justify-around items-center shadow-2xs">
            <img src="https://cdn.britannica.com/07/266507-050-095F46AB/Publicity-still-scene-The-Wild-Robot-movie.jpg"
                alt="logo" className="max-h-[70%]" />
            <div className="flex items-center justify-between">
                {username && (
                    <div>
                        <span className="text-lg font-bold">{username}</span>
                    </div>
                )}
                <div className={`before:border-2 before:absolute before:top-0 before:h-full`}>
                    {username ? <Link className="ml-5" to="/logout" onClick={handleLogout}>Logout</Link> :
                        <Link className="ml-5" to="/" onClick={handleLogout}>Login</Link>}
                </div>
            </div>
        </div>
    )
}

export default NavBar