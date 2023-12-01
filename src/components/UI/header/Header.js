import { Link, useSearchParams, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { logout } from "../../../api/auth";
import './header.css';

function Header() {
    const [ searchParams, setSearchParams ] = useSearchParams();
    const [ search, setSearch ] = useState('')
    const dispatch = useDispatch();
    const isAuth = useSelector(state => state.auth.authorizationStatus)

    let username = '';
    let id = '';
    if (isAuth) {
        const token = localStorage.getItem('token');
        const decodedToken = jwtDecode(token);
        username = decodedToken.login;
        id = decodedToken.id;
    }    

    function handleSearchChange(e) {
        const value = e.target.value;
        setSearch(value);
        if (value)
            searchParams.set('search', value);
        else
            searchParams.delete('search');

        setSearchParams(searchParams);
    }    

    async function click() {
        if(isAuth) {
            try {
                await logout();
                dispatch({type: "LOG_OUT"});
                localStorage.setItem('isAuth', 'false');
                localStorage.removeItem('token');
                localStorage.removeItem('avatar');
                window.location.reload();
            } catch (e) {
                console.log(e);
            }
        }
    }
        
    useEffect(() => {
        if (localStorage.getItem('isAuth') === 'true')
            dispatch({type: "LOG_IN"});
        else
            dispatch({type: "LOG_OUT"});
    },[]);

    return (
        <div className={'header'}>
            <div className={'logo'}>
                <Link className={'logo-link'} to={'/posts'}>AskU</Link>
            </div>
            <div className={'head-list'}>
                <ul>
                    <li><Link to={'/posts'}>Posts</Link></li>
                    <li><Link to={'/categories'}>Categories</Link></li>
                    <li><Link to={'/about'}>About</Link></li>
                </ul>
            </div>
            {window.location.pathname === '/posts' ?
                <div className={'search-div'}>
                    <input
                        type="text"
                        value={search}
                        onChange={handleSearchChange}
                        className={'search-input'}
                        placeholder={'Search'}
                    />
                </div> : ''
            }
            <div>
                {isAuth ? (
                    <div>
                        <Link className={'profile-link'} to={`/users/${id}`}>{username}</Link>
                        <button className={'logout-button'} onClick={click}>Logout</button>
                    </div>
                ) : (
                    <NavLink to="/login">
                        <button className="login-button">Log In</button>
                    </NavLink>
                )}
            </div>
        </div>
    );
}

export default Header;