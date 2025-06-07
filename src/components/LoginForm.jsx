import { Link, useNavigate } from 'react-router-dom'
import './loginform.css'
import { useState } from 'react'
import BackendApi from '../services/BackendApi'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Input from './Input';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import {setUsername, clearUsername} from '../features/users/userSlice';

export default function LoginForm() {

    const [form, setForm] = useState({
        username: '',
        password: '',
        error: ''
    });

    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.name);
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
                localStorage.setItem('id', token_response.data.id);
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
        setForm(prev => ({ ...prev, [name]: value }))
    }
    const [visible, setVisible] = useState(false)


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <form
                id="login"
                onSubmit={login_handling}
                className="w-full max-w-md bg-white p-6 rounded-lg shadow-md relative"
            >
                {/* Spinner overlay */}
                <div
                    id="spinner"
                    className={`absolute top-0 left-0 w-full h-full bg-white bg-opacity-70 flex items-center justify-center z-10 ${loading ? '' : 'hidden'}`}
                >
                    <div className="flex space-x-2">
                        <span className="w-4 h-4 bg-blue-500 rounded-full animate-bounce animation-delay-200"></span>
                        <span className="w-4 h-4 bg-blue-500 rounded-full animate-bounce animation-delay-400"></span>
                        <span className="w-4 h-4 bg-blue-500 rounded-full animate-bounce animation-delay-600"></span>
                    </div>
                </div>

                {/* Username input */}
                <Input
                    label="Username"
                    autoComplete="username"
                    name="username"
                    onChange={changeHandling}
                    value={form.username}
                    type="text"
                    className="h-10 w-full px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter Username"
                    required
                />

                {/* Password input */}
                <Input
                    label="Password"
                    autoComplete="current-password"
                    key="password"
                    name="password"
                    type={!visible ? 'password' : 'text'}
                    value={form.password}
                    onChange={changeHandling}
                    className="h-10 w-full px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter Password"
                    required
                >
                    <FontAwesomeIcon
                        icon={visible ? faEye : faEyeSlash}
                        className="absolute bottom-[10%] right-3 cursor-pointer text-gray-500"
                        onClick={() => setVisible(!visible)}
                    />
                </Input>

                {/* Submit button */}
                <div className="mt-4">
                    <button
                        disabled={loading}
                        className={`w-full h-10 rounded-md font-semibold text-white transition-colors ${
                            loading
                                ? 'bg-blue-300 cursor-not-allowed'
                                : 'bg-green-500 hover:bg-green-600'
                        }`}
                    >
                        {loading ? 'Loading...' : 'Log In'}
                    </button>
                </div>

                {/* Error message */}
                {form.error && (
                    <div className="mt-3 bg-red-100 text-red-700 px-4 py-2 rounded-md text-sm">
                        {form.error}
                    </div>
                )}

                {/* Links */}
                <div className="mt-4 flex justify-between text-sm">
                    <Link
                        to="/signup"
                        className="text-blue-500 underline hover:text-blue-700"
                    >
                        Sign Up
                    </Link>
                    <Link
                        to="/reset"
                        className="text-blue-500 underline hover:text-blue-700"
                    >
                        Reset Password
                    </Link>
                </div>
            </form>
        </div>
    );
}