import axios from 'axios';

const BackendApi = axios.create({
    baseURL: 'http://localhost:8000',
	headers: {
		'Content-Type': 'application/json'
	},
    withCredentials: true,
})

BackendApi.interceptors.response.use(
	(response) => {
        console.log(response)
		return response;
	},
	(error) => {
		return Promise.reject(error);
		});


export default BackendApi