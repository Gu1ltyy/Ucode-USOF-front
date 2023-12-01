import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { resetWithToken } from "../../api/auth";
import Header from "../UI/header/Header";
import Footer from "../UI/footer/Footer";
import './auth.css';

function ResetWithToken() {
    const [ password, setPassword ] = useState('');
    const [ confirmPassword, setConfirmPassword ] = useState('');
    const [ error, setError ] = useState('');
    const [ success, setSuccess ] = useState('');
    const { token } = useParams();

    async function resetPassword() {
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
    
        try {
            await resetWithToken({ resetToken: token, newPassword: password });
            setSuccess('Your password has been reset successfully. ');
            setPassword('');
            setConfirmPassword('');
        } catch (err) {
            if (err.response.data === 'Invalid or expired reset token.') {
                setError('Invalid or expired reset token.');
            } else {
                setError('Something went wrong, please try again later.');
            }
        }
    }     

    return (
        <div>
            <Header/>
            <div className={'form'}>
                <h1>Reset Password</h1>
                <label>New Password:</label>
                <input
                    className={'auth-input'}
                    type={"password"}
                    onChange={e => setPassword(e.target.value)}
                />
                <label>Confirm New Password:</label>
                <input
                    className={'auth-input'}
                    type={"password"}
                    onChange={e => setConfirmPassword(e.target.value)}
                />
                <div className={'auth-success'}>
                    {success && (
                        <>
                        {success}
                        <Link to={'/login'}>Go to Login</Link>
                        </>
                    )}
                </div>
                <div className={'auth-error'}>{error}</div>
                <button className={'auth-button'} style={{marginTop: '10px'}} onClick={resetPassword}>Reset Password</button>
            </div>
            <Footer/>
        </div>
    );
}

export default ResetWithToken;