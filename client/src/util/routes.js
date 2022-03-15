import React from "react";

import {
    Route,
    BrowserRouter,
    Routes
  } from "react-router-dom";

const Layout = React.lazy(() => import("../hoc/Layout"));
const PrivateRoute = React.lazy(() => import("./PrivateRoute"));
const Login = React.lazy(() => import("../containers/Auth/Login"));
const Dashboard = React.lazy(() => import("../containers/Dashboard"));
const SelectedPlayers = React.lazy(() => import("../containers/selected-players"));
const AddPlayers = React.lazy(() => import("../containers/add-players"));
const NotFound = React.lazy(() => import("../containers/NotFound/"));

const Routers = () => {
    return <BrowserRouter>
                <Layout>
                    <Routes>
                        <Route 
                            path="/" 
                            element={<Login />} 
                        />
                        <Route 
                            path="/login" 
                            element={<Login />} 
                        />
                        <Route 
                            path="*" 
                            element={<NotFound />} 
                        />
                        <Route 
                            path="/dashboard" 
                            element={
                                    <PrivateRoute>
                                        <Dashboard />
                                    </PrivateRoute>        
                            } 
                        />
                        <Route 
                            path="/selected-players" 
                            element={
                                    <PrivateRoute>
                                        <SelectedPlayers />
                                    </PrivateRoute>                        
                            } 
                        />
                        <Route 
                            path="/add-players" 
                            element={
                                    <PrivateRoute>
                                        <AddPlayers />
                                    </PrivateRoute>                       
                            } 
                        />
                    </Routes>                        
                </Layout>
            </BrowserRouter>
}

export default Routers;
