import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { activation } from "../../api/auth";
import Header from "../UI/header/Header";
import Footer from "../UI/footer/Footer";
import './auth.css'

function Activate() {
    const [ status, setStatus ] = useState('loading');
    const { link, id } = useParams();

    useEffect(() => {
        async function activateUser() {
            try {
                await activation(link, id);
                setStatus('success');
            } catch (err) {
                setStatus('error');
            }
        }

        activateUser();
    }, [link, id]);

    if (status === 'loading') {
        return (
            <div>
                <Header />
                <div className={'form'}>
                    <h1>Loading...</h1>
                </div>
                <Footer/>
            </div>
        );
    }

    if (status === 'success') {
        return (
            <div>
                <Header />
                <div className={'form'}>
                    <h1>Activation Successful!</h1>
                    <p className={'auth-success'}>Your account has been activated.</p>
                </div>
                <Footer/>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div>
                <Header />
                <div className={'form'}>
                    <h1>Activation Error</h1>
                    <p className={'auth-error'}>There was an error activating your account. Please try again later.</p>
                </div>
                <Footer/>
            </div>
        );
    }
}

export default Activate;