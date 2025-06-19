import { useNavigate } from "react-router-dom"

export default function Employee() {
    const navigate = useNavigate()
    const backHandling = ()=>{
        navigate('dashboard')
    }
    return (
        <div>
            <ol>
                <li onClick={backHandling}>Employee</li>
            </ol>

        </div>
    )
}