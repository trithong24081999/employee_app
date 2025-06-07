import NavBar from '../components/navbar';
import Footer from '../components/Footer';
import { Outlet } from 'react-router-dom';



export default function Dashboard(){

    return (
        <div className="flex flex-col w-screen h-screen">
            <NavBar/>
            <div className="mt-[10%] max-h-[80%] flex justify-center overflow-y-auto">
                <Outlet/>
            </div>
            <Footer/>
        </div>
    )
}