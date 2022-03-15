import React from "react";
import { Navigate } from "react-router-dom";
import useAuthContext from "../hooks/useAuthContext";

const Logout = () => {
    const { setAuthTokens } = useAuthContext();
    setAuthTokens();
    localStorage.clear();
    return <Navigate to="/" />;
}
export default Logout;