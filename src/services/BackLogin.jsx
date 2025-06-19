import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { clearUsername } from "../features/users/userSlice";

export default function BackLogin() {
    const dispatch = useDispatch(); // ✅ use the hook to get dispatch

    useEffect(() => {
        localStorage.clear();
        dispatch(clearUsername()); // ✅ dispatch the action correctly
    }, [dispatch]);

    return <Navigate to="/" />;
}
