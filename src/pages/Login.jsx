import { Outlet } from "react-router-dom"
import Footer from "../components/Footer"
import NavBar from "../components/navbar"

function LoginPage(){
    return (
        <div className="flex flex-col w-screen h-screen">
            <NavBar/>
            <Outlet />
            <Footer/>
        </div>
    )
}

export default LoginPage