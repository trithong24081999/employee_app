import axios from 'axios';

const BackendApi = axios.create({
    baseURL: 'http://localhost:8000',
	headers: {
		'Content-Type': 'application/json'
	},
    withCredentials: true,
})

BackendApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers = {
                ...config.headers,
                Authorization: `Bearer ${token}`,
            };
        }
        return config;
    },
    (error) => Promise.reject(error)
);


BackendApi.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		return Promise.reject(error);
		});


export default BackendApi