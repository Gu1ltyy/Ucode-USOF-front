import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../api/auth";
import Header from "../UI/header/Header";
import Footer from "../UI/footer/Footer";
import './auth.css';

function Register() {
    const [ user, setUser ] = useState({});
    const [ confirmPassword, setConfirmPassword ] = useState('');
    const [ error, setError ] = useState('');
    const navigate = useNavigate();

    async function registerUser() {
        if (user.password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await register(user);
            localStorage.setItem('token', response.data.accessToken);
            navigate('/login');
        } catch (err) {
            setError(err.response.data);
        }
    }

    return (
        <div>
            <Header/>
            <div className={'form reg-form'}>
                <h1>Register</h1>
                <label>Login:</label>
                <input
                    className={'auth-input'}
                    type={"text"}
                    onChange={e => setUser({...user, login: e.target.value})}
                />
                <label>Password:</label>
                <input
                    className={'auth-input'}
                    type={"password"}
                    onChange={e => setUser({...user, password: e.target.value})}
                />
                <label>Confirm password:</label>
                <input
                    className={'auth-input'}
                    type={"password"}
                    onChange={e => setConfirmPassword(e.target.value)}
                />
                <label>Full Name:</label>
                <input
                    className={'auth-input'}
                    type={"text"}
                    onChange={e => setUser({...user, name: e.target.value})}
                />
                <label>Email:</label>
                <input
                    className={'auth-input'}
                    type={"text"}
                    onChange={e => setUser({...user, email: e.target.value})}
                />
                <div className={'auth-error'}>{error}</div>
                <button className={'auth-button'} style={{marginTop: '10px'}} onClick={registerUser}>Register</button>
            </div>
            <br></br>
            <div className={'auth-phrase'}>
                <span className={'auth-phrase'}>Already have an account? </span><Link className={'auth-link'} to={'/login'}>Login here</Link>
            </div>
            <Footer/>
        </div>
    );    
}

export default Register;