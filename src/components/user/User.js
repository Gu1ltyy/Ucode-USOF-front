import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import Post from "../posts/Post";
import { getPostsByUser, getUserById, changeAvatar } from "../../api/user";
import Header from "../UI/header/Header";
import Footer from "../UI/footer/Footer";
import './user.css';
import '../categories/categories.css'

function User() {
    const { userId } = useParams()
    const [ user, setUser ] = useState({});
    const [ posts, setPosts ] = useState([]);
    const [ tempUser, setTempUser ] = useState({});
    const isAuth = useSelector(state => state.auth.authorizationStatus);
    const [ img, setImg ] = useState(null);
    const [ avatar, setAvatar ] = useState('');
    const [ fileName, setFileName ] = useState('');
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setImg(e.target.files[0]);
            setFileName(e.target.files[0].name);
        }
    }    

    const sendFile = useCallback(async () => {
        if (img) {
            try{
                const data = new FormData();
                data.append('avatar', img);
                console.log(img);
                const response = await changeAvatar(data);
                console.log(response.data)
                setAvatar(response.data)
                localStorage.setItem('avatar', response.data)
                setFileName('Choose file');
            }
            catch (e) {
                console.log(e.response);
            }
        }
    }, [img]);

    const updateUser = useCallback(async () => {
        try {
            const response = await getUserById(userId);
            setUser(response.data);
        } catch (err) {
            console.log(err);
        }
    }, [userId]);
    
    useEffect(() => {
        updateUser();
    }, [updateUser]);

    useEffect(() => {
        const authStatus = localStorage.getItem('token') ? jwtDecode(localStorage.getItem('token')) : {};
        setTempUser(authStatus);
    }, [isAuth]);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await getUserById(userId);
                const postsRes = await getPostsByUser(userId);
                setUser(response.data);
                setPosts(postsRes.data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }, [userId, navigate]);    

    return (
        <div>
            <Header/>
            <div className={'profile-global-container'}>
                <div className={'user-container'}>
                    <div className={'user-avatar'}>
                        <img src={`http://localhost:3001/avatars/${avatar || user.picture}`} alt="avatar"/>
                    </div>
                    <div className={'user-info'}>
                        <div className={'user-login'}>Login: <span>{user.login}</span></div>
                        <div className={'user-name'}>Name: <span>{user.name}</span></div>
                        <div className={'user-email'}>Email: <span>{user.email}</span></div>
                        <div className={'user-rating'}>Rating: <span>{user.rating}</span></div>
                        <div className={'user-role'}>Role: <span>{user.role}</span></div>
                    </div>
                    {tempUser.id === user.id &&
                        <hr className={'user-hr'}></hr>
                    }
                    {tempUser.id === user.id &&
                        <div className={'user-settings'}>
                            <label htmlFor="avatar" className={'file-label'}>{fileName || 'Choose file'}</label>
                            <input id="avatar" className={'file-input'} accept={'image/*'} type={"file"} name={'avatar'} onChange={handleFileChange}/>
                            <button onClick={sendFile} className={'change-avatar-button'}>Change avatar</button>
                        </div>                
                    }
                </div>
                <div className={'posts-container'}>
                    <h1 className={'category-title'}>User`s posts</h1>
                    {posts.length > 0 ? posts.map(post =>
                        <Post key={post.id} 
                            className="post-page-container users-page-post post" 
                            title={post.title}
                            owner={post.owner}
                            owner_id={post.owner_id}
                            content={post.content}
                            date={post.date}
                            category={post.categories.split(',')}
                            rating={post.rating}
                            edited={post.edited}
                            id={post.id}
                            isUser={tempUser.id === user.id}
                            onUpdate={updateUser}
                        />
                    ) : ''}
                    <div className={'last-phrase'}>That's all</div>
                </div>
            </div>
            <Footer/>
        </div>
    );
}

export default User;