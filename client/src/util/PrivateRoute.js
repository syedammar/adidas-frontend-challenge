import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthContext from "../hooks/useAuthContext";

function PrivateRoute({children}) {
    const { authTokens  } = useAuthContext();
    return authTokens ? children : <Navigate to="/login" />;
}

export default PrivateRoute;