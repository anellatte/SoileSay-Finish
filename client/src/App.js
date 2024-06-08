// src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Account from "./components/account/Account";
import Sidebar from "./components/sidebar/Sidebar";
import SuraqJauap from "./components/suraq-jauap/SuraqJauap";
import MaqalDrop from "./components/maqal-drop/MaqalDrop";
import Talda from "./components/talda/Talda";
import Tanda from "./components/tanda/Tanda";
import Sozdly from "./components/sozdly/Sozdly";
import Home from "./components/home/Home";
import SignIn from "./components/authorization/SignIn";
import SignUp from "./components/authorization/SignUp";
import Profile from "./components/account/Profile";
import AdminMaqalDrop from "./components/admin/AdminMaqalDrop";
import AdminSuraqJauap from "./components/admin/AdminSuraqJauap";
import AdminPage from "./components/admin/AdminPage";
import AdminAddNews from "./components/admin/AdminAddNews";
import AdminEditNews from "./components/admin/AdminEditNews";
import AdminTalda from "./components/admin/AdminTalda";
import AdminTaldaAdd from "./components/admin/AdminTaldaAdd";
import AdminTaldaEdit from "./components/admin/AdminTaldaEdit";
import AdminSJAdd from "./components/admin/AdminSJAdd";
import AdminSJEdit from "./components/admin/AdminSJEdit"; 
import AdminSozdly from './components/admin/AdminSozdly';
import AdminSozdlyAdd from './components/admin/AdminSozdlyAdd';
import AdminSozdlyEdit from './components/admin/AdminSozdlyEdit';

import ErrorBoundary from "./components/ErrorBoundary";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userData, setUserData] = useState({});

    const handleLogin = (userData) => {
        setIsAuthenticated(true);
        setUserData(userData);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setUserData({});
    };

    return (
        <Router>
            <ErrorBoundary>
                <div className="App">
                    {!isAuthenticated ? (
                        <div className="authorization">
                            <Routes>
                                <Route path="/" element={<SignIn onLogin={handleLogin} />} />
                                <Route path="/signup" element={<SignUp onLogin={handleLogin} />} />
                            </Routes>
                        </div>
                    ) : (
                        <>
                            <Sidebar isAdmin={userData.isAdmin} />
                            <div className="content">
                                <Routes>
                                    <Route path="/home" element={
                                        <>
                                            <Home />
                                            <Account username={userData.username} email={userData.email} onLogout={handleLogout} />
                                        </>
                                    } />
                                    <Route path="/tanda" element={<Tanda />} />
                                    <Route path="/maqalDrop" element={<MaqalDrop />} />
                                    <Route path="/suraqJauap" element={<SuraqJauap />} />
                                    <Route path="/talda" element={<Talda />} />
                                    <Route path="/sozdly" element={<Sozdly />} />
                                    <Route path="/profile" element={<Profile />} />
                                    {userData.isAdmin && (
                                        <>
                                            <Route path="/adminMaqalDrop" element={<AdminMaqalDrop username={userData.username} />} />
                                            <Route path="/admin/sj" element={<AdminSuraqJauap username={userData.username} />} />
                                            <Route path="/admin/talda" element={<AdminTalda />} />
                                            <Route path="/admin/sozdly" element={<AdminSozdly />} />
                                            <Route path="/admin" element={<AdminPage />} />
                                            <Route path="/admin/add" element={<AdminAddNews />} />
                                            <Route path="/admin/edit/:id" element={<AdminEditNews />} />
                                            <Route path="/admin/talda/add" element={<AdminTaldaAdd />} />
                                            <Route path="/admin/talda/edit/:id" element={<AdminTaldaEdit />} />
                                            <Route path="/admin/sj/add" element={<AdminSJAdd />} />
                                            <Route path="/admin/sj/edit/:id" element={<AdminSJEdit />} />
                                            <Route path="/admin/sozdly/add" element={<AdminSozdlyAdd />} />
                                            <Route path="/admin/sozdly/edit/:id" element={<AdminSozdlyEdit />} />
                                        </>
                                    )}
                                </Routes>
                            </div>
                        </>
                    )}
                </div>
            </ErrorBoundary>
        </Router>
    );
}

export default App;
