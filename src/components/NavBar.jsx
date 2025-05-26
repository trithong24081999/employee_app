import { Link } from "react-router-dom"

function NavBar(){
    return (
        <div  className="absolute top-0 h-[10%] w-screen bg-amber-50 flex justify-around items-center shadow-2xs">
            <img src="https://cdn.britannica.com/07/266507-050-095F46AB/Publicity-still-scene-The-Wild-Robot-movie.jpg"
                alt="logo" className="max-h-[70%]"/>
            <div className={`before:border-2 before:absolute before:top-0 before:h-full`}>
                <Link className="ml-5" to="/">Login</Link>
            </div>
        </div>
    )
}

export default NavBar