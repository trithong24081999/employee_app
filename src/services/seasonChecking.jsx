import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import BackendApi from "./BackendApi";
import { useDispatch } from "react-redux";
import { clearUsername, setUsername } from "../features/users/userSlice";

const CheckTokenExpiry = ({ children }) => {
    const location = useLocation();
    const dispatch = useDispatch();
    const UpdateUserInformation = async () => {
        const userId = localStorage.getItem('id');
        if (userId) {
            try {
                const response = await BackendApi.get(`api/user/${userId}/`);
                if (response && response.data) {
                    dispatch(setUsername(response.data.username || "Unknown"));

                } else {
                    console.error('Failed to fetch user information');

                    dispatch(clearUsername());
                }
            } catch (error) {
                console.error('Error fetching user info:', error);
                dispatch(clearUsername());
            }
        } else {
            dispatch(clearUsername());
        }
    };

    useEffect(() => {
        const checkAndUpdateUser = async () => {
            const now = Date.now();
            const tokenExp = parseInt(localStorage.getItem('token_expires') || '0', 10);

            if (!tokenExp || now >= tokenExp) {
                try {
                    const response = await BackendApi.post('api/refresh/');
                    if (response && response.data.token) {
                        localStorage.setItem('token', response.data.token);
                        localStorage.setItem('token_expires', response.data.token_exp* 1000);
                    } else {
                        localStorage.clear();
                        window.location.href = '/';
                        return;
                    }
                } catch (err) {
                    console.error('Token refresh failed:', err);
                    localStorage.clear();
                    window.location.href = '/';
                    return;
                }
            }

            await UpdateUserInformation();

        };

        checkAndUpdateUser();
    }, [location]);

    return <Outlet/>;
};


export default CheckTokenExpiry;
