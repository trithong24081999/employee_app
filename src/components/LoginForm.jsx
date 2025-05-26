import { Link, useNavigate } from 'react-router-dom'
import './loginform.css'
import { useState } from 'react'
import BackendApi from '../services/BackendApi'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Input from './Input';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function LoginForm() {

    const [form, setForm] = useState({
        username: '',
        password: '',
        error: ''
    });

    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const login_handling = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token_response = await BackendApi.post('api/token/', { username: form.username, password: form.password });

            if (token_response && token_response.data) {
                localStorage.setItem('token', token_response.data.token);
                localStorage.setItem('token_expires', Date.now() + token_response.data.token_expires * 1000);
                toast.success("Log In successfully.");
                navigate('/dashboard');
            } else {

                setForm(prev => ({ ...prev, error: 'Login failed: no token received' }));
            }
        } catch (error) {
            // Nếu Backend trả lỗi, ví dụ 401 Unauthorized
            console.error('Login error:', error);
            // Có thể lấy lỗi từ error.response.data
            const message = error.response?.data?.error || 'Login failed, please check username/password';
            setForm(prev => ({ ...prev, error: message }));
        }
        finally {
            setLoading(false);

        }
    }

    const changeHandling = (e) => {
        const { name, value } = e.target
        console.log(e.target.value)
        setForm(prev => ({ ...prev, [name]: value }))
    }
    const [visible, setVisible] = useState(false)


    return (
        <div className="h-[60%] mt-[10%] flex justify-center">
            <form id="login" onSubmit={login_handling}>
                <div id="spinner" className={`absolute top-0 left-0 w-full h-full bg-gray-200 bg-opacity-50 flex items-center justify-center ${loading ? '' : 'hidden'}`}>
                    <div className="flex space-x-2">
                        <span className="w-4 h-4 bg-blue-500 rounded-full animate-bounce animation-delay-200"></span>
                        <span className="w-4 h-4 bg-blue-500 rounded-full animate-bounce animation-delay-400"></span>
                        <span className="w-4 h-4 bg-blue-500 rounded-full animate-bounce animation-delay-600"></span>
                    </div>                </div>
                <Input label="Username" autoComplete="username" name="username" onChange={changeHandling} value={form.username}
                    type="text" className='h-10 w-75 pl-5 rounded-sm border border-gray-300 focus:outline-1 focus:border-red-300' placeholder="Enter Username" required="required" />
                <Input label="Password" autoComplete="current-password" key="password" name="password" type={!visible ? 'password' : 'text'} value={form.password} onChange={changeHandling} className='h-10 w-75 rounded-sm border border-gray-300 focus:outline-1 focus:border-red-300 pl-5' placeholder="Enter Password" required >
                    <FontAwesomeIcon icon={visible ? faEye : faEyeSlash} className="absolute pl-5 bottom-[10%] right-3 cursor-pointer"
                        onClick={(e) => {
                            setVisible(!visible)
                        }} />
                </Input>

                {/* <div className="flex flex-col">
                    <label className="w-full font-bold">Username</label>
                    <input autoComplete="username" name="username" onChange={changeHandling} value={form.username}
                        type="text" className='h-10 w-75 rounded-sm border border-gray-300 focus:outline-1 focus:border-red-300' placeholder="Enter Username" required />
                </div>
                <div className="flex flex-col relative">
                    <label className="w-full font-bold">Password</label>
                    <input autoComplete="current-password"  key="password" name="password" type={!visible?'password':'text'} value={form.password} onChange={changeHandling} className='relative h-10 w-75 rounded-sm border border-gray-300 focus:outline-1 focus:border-red-300' placeholder="Enter Password" required />            
                    <FontAwesomeIcon icon={visible?faEye:faEyeSlash} className="absolute bottom-[10%] right-3 cursor-pointer"
                    onClick={(e)=>{
                        setVisible(!visible)
                    }}/>
                </div> */}
                <div>
                    <button disabled={loading} className={`bg-blue-300 h-10 w-full rounded-sm ${loading ? '' : 'hover:opacity-90 hover:bg-green-400'}`}>{loading ? "Loading" : "Log In"}  </button>
                </div>
                <div>

                    {
                        form.error && <div className='bg-red-500 text-black font-normal max-w-75 rounded-sm shadow'>
                            {form.error}
                        </div>
                    }
                </div>
                <div className='flex justify-around'>
                    <Link to="/signup" className='underline text-green-500 hover:opacity-80 hover:text-blue-500'><i></i>Sign in</Link>
                    <Link to="/reset" className='underline text-green-500 hover:opacity-80 hover:text-blue-500'>Reset Password</Link>
                </div>
            </form>
        </div>
    )
}