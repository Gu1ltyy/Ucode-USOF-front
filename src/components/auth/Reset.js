import { useState } from "react";
import { Link } from "react-router-dom";
import { reset } from "../../api/auth";
import Header from "../UI/header/Header";
import Footer from "../UI/footer/Footer";
import './auth.css';

function Reset() {
    const [ email, setEmail ] = useState('');
    const [ error, setError ] = useState('');
    const [ success, setSuccess ] = useState('');

    async function resetPass() {
        try {
            await reset(email);
            setSuccess('A password reset link has been sent to your email');
            setEmail('');
        } catch (err) {
            if (err.response.data === 'E-mail was not found') {
                setError('Email not found. ');
            } else {
                setError('ERROR');
            }
        }
    }    

    return (
        <div>
            <Header/>
            <div className={'form'}>
                <h1>Reset password</h1>
                <label>Email linked to the account:</label>
                <input
                    className={'auth-input'}
                    type={"text"}
                    onChange={e => setEmail(e.target.value)}
                />
                <div className={'auth-error'}>
                    {error && (
                        <>
                        {error}
                        <Link className={'register-link'} to={'/register'}><br></br>Would you like to register?</Link>
                        </>
                    )}
                </div>
                <div className={'auth-success'}>{success}</div>
                <button className={'auth-button'} style={{marginTop: '10px'}} onClick={resetPass}>Send</button>
            </div>
            <br></br>
            <div className={'auth-phrase'}>
                <span className={'auth-phrase'}>Remember your password? </span><Link className={'auth-link'} to={'/login'}>Login</Link>
            </div>
            <Footer/>
        </div>
    );
}

export default Reset;