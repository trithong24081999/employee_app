export default function Dashboard(){
    return (
        <div className="flex flex-col w-screen h-screen">
            <NavBar/>
            <Outlet/>
            <Footer/>
        </div>
    )
}