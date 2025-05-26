import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import LoginPage from './pages/login'
import LoginForm from './components/LoginForm'
import SignUp from './components/SignUp'
import Dashboard from './pages/Dashboard'
import CheckTokenExpiry from './services/seasonChecking'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useStore, useDispatch, useDispatch} from 'react-redux';

function App() {
	const [count, setCount] = useState(0)
	const location = useLocation();

	return (
		<>
			<Routes>
				<Route path="/" element={<LoginPage />}>
					<Route index element={<LoginForm/>}/>
					<Route path="signup" element={<SignUp/>}/>
				</Route>
				<Route path="/dashboard" element={
					<CheckTokenExpiry>
						<Dashboard/>
					</CheckTokenExpiry>}/>
				<Route path="*" element={<Navigate to="/"/>}/>
			</Routes>
			<ToastContainer
					position="top-right"
					autoClose={3000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
					theme="light"
				/>
		</>
	)
}

export default App
