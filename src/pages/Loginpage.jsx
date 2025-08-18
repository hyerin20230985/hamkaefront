import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Login from '../components/Login';

const Loginpage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/map');
        }
    }, [navigate]);

    const handleLoginSuccess = () => {
        navigate('/map');
    };

    return (
        <div>
            <Login onLoginSuccess={handleLoginSuccess} />
        </div>
    );
};

export default Loginpage;
