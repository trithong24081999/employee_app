import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import LoginPage from './pages/Login'
import LoginForm from './components/LoginForm'
import SignUp from './components/SignUp'
import Dashboard from './pages/Dashboard'
import CheckTokenExpiry from './services/seasonChecking'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DashboardContent from './components/dashboard'
import Employee from './components/Employee'
import BackLogin from './services/BackLogin'

function App() {
	const [count, setCount] = useState(0)
	const location = useLocation();

	return (
		<>
			<Routes>
				<Route path="/" element={<LoginPage />}>
					<Route index element={<LoginForm />} />
					<Route path="signup" element={<SignUp />} />
				</Route>
				<Route element={<CheckTokenExpiry />}>
					<Route path="/dashboard" element={<Dashboard />}>
						<Route index element={<DashboardContent />} />
						<Route path="employee/:id" element={<Employee />} />
					</Route>
				</Route>

				<Route path="*" element={<BackLogin/>} />
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
