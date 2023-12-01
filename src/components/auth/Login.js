import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, checkAuth } from "../../api/auth";
import Header from "../UI/header/Header";
import Footer from "../UI/footer/Footer";
import './auth.css';

function Login() {
    const [ user, setUser ] = useState({});
    const [ error, setError ] = useState('');

    const dispatch = useDispatch();
    const isAuth = useSelector(state => state.auth.authorizationStatus);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            checkAuth().then(res => {
                if (res) {
                    dispatch({ type: "LOG_IN" });
                    localStorage.setItem('isAuth', 'true');
                }
            });
        }
    }, [dispatch]);

    const navigate = useNavigate();

    const handleInputChange = (field, value) => {
        setUser({ ...user, [field]: value });
    };

    const loginUser = async () => {
        try {
            const response = await login(user);
            localStorage.setItem('token', response.data.accessToken);
            dispatch({ type: "LOG_IN" });
            localStorage.setItem('isAuth', 'true');
        } catch (err) {
            setError(err.response.data);
        }
    };

    if (isAuth) {
        navigate('/');
        return;
    }

    return (
        <div>
            <Header />
            <div className={'form'}>
                <h1>Authorize</h1>
                <label>Login:</label>
                <input
                    className={'auth-input'}
                    type={"text"}
                    onChange={e => handleInputChange('login', e.target.value)}
                />
                <label>Password:</label>
                <input
                    className={'auth-input'}
                    type={"password"}
                    onChange={e => handleInputChange('password', e.target.value)}
                />
                <div className={'auth-error'}>{error}</div>
                <div className={'auth-buttons'}>
                    <button className={'auth-button'} onClick={loginUser}>Login</button>
                    <button className={'auth-button'} onClick={() => navigate('/register')}>Register</button>
                </div>
            </div>
            <br></br>
            <div className={'auth-phrase'}>
                <span className={'auth-phrase'}>Forgot your password? </span><Link className={'auth-link'} to={'/reset'}>Reset it</Link>
            </div>
            <Footer/>
        </div>
    );
}

export default Login;