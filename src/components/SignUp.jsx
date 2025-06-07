    import { Link, useNavigate } from 'react-router-dom'
    import './loginform.css'
    import { useState } from 'react'
    import BackendApi from '../services/BackendApi'
    import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
    import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
    import Input from './Input';

    export default function SignUp() {
        const [form, setForm] = useState({
            username: '',
            password: '',
            re_password: '',
            error: ''
        });
        const navigate = useNavigate()
        const [visible, setVisible] = useState(false)

        const signUp_handling = async (e) => {
            e.preventDefault();
            if (form.password !== form.re_password || !form.password) {
                setForm(prev => ({ ...prev, error: "Passwords do not match" }));
                return;
            }
            try {

                const response = await BackendApi.post(
                    'api/user/create/',
                    { username: form.username, password: form.password },
                    { withCredentials: false }  // ghi đè cho riêng request này
                );
                if (response && response.data) {
                    navigate('/login'); // Redirect to login after successful registration
                } else {
                    setForm(prev => ({ ...prev, error: 'Registration failed' }));
                }
            } catch (error) {
                console.error('Registration error:', error);
                const message = error.response?.data?.error || 'Registration failed, please try again';
                setForm(prev => ({ ...prev, error: message }));
            }
        }

        const changeHandling = (e) => {
            const { name, value } = e.target
            setForm(prev => ({ ...prev, [name]: value }))
        }

        return (
            <div className="h-[60%] mt-[10%] flex justify-center">
                <form id="signup" onSubmit={signUp_handling}>
                    <Input label="Username" autoComplete="username" name="username" onChange={changeHandling} value={form.username}
                        type="text" className='h-10 w-75 pl-5 rounded-sm border border-gray-300 focus:outline-1 focus:border-red-300' placeholder="Enter Username" required="required" />
                    <Input label="Password" autoComplete="new-password" name="password" type={!visible ? 'password' : 'text'} value={form.password} onChange={changeHandling} className='h-10 w-75 rounded-sm border border-gray-300 focus:outline-1 focus:border-red-300 pl-5' placeholder="Enter Password" required >
                        <FontAwesomeIcon icon={visible ? faEye : faEyeSlash} className="absolute pl-5 bottom-[10%] right-3 cursor-pointer"
                            onClick={() => setVisible(!visible)} />
                    </Input>
                    <Input label="Re-Password" autoComplete="new-password" name="re_password" type={!visible ? 'password' : 'text'} value={form.re_password} onChange={changeHandling} className='h-10 w-75 rounded-sm border border-gray-300 focus:outline-1 focus:border-red-300 pl-5' placeholder="Re-enter Password" required >
                        <FontAwesomeIcon icon={visible ? faEye : faEyeSlash} className="absolute pl-5 bottom-[10%] right-3 cursor-pointer"
                            onClick={() => setVisible(!visible)} />
                    </Input>
                    <div>
                        <button className='bg-blue-300 h-10 w-full rounded-sm hover:opacity-90 hover:bg-green-400'>Sign Up</button>
                    </div>
                    {form.error && <div className='bg-red-500 text-black font-normal max-w-75 rounded-sm shadow'>{form.error}</div>}
                </form>
            </div>
        )
    }