import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import BackendApi from "./BackendApi";

const CheckTokenExpiry = ({ children }) => {
    const location = useLocation();
    useEffect(() => {
        const now = Date.now();
        const tokenExp = parseInt(localStorage.getItem('token_expires') || '0', 10);
        console.log(now, tokenExp, 111)
        if (!tokenExp || now >= tokenExp) {
            const refreshToken = async () => {
                try {
                    const response = await BackendApi.post('api/refresh/');
                    if (response && response.data.token) {
                        localStorage.setItem('token', response.data.token);
                        localStorage.setItem('token_expires', response.data.token_expires);
                        console.log(token_expires, 11)
                    } else {
                        localStorage.clear();
                        window.location.href = '/';
                    }
                } catch (err) {
                    localStorage.clear();
                    window.location.href = '/';
                }
            };
            refreshToken();
        }
    }, [location]);

    return children;
};

export default CheckTokenExpiry;
