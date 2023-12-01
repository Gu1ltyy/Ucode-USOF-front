import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { setPostLike, setPostDislike, deletePostLike, deletePost, getPostLike } from "../../api/post"
import { getCategories } from "../../api/category";
import './post.css';

function Post(props) {
    const [ rating, setRating ] = useState(props.rating);
    const [ likes,  setLikes] = useState([]);
    const [ dislikes, setDislikes ] = useState([]);
    const [ postCategories, setPostCategories ] = useState([]);
    const isAuth = useSelector(state => state.auth.authorizationStatus)
    const postClass = props.className ? props.className : 'post-page-container post';
    const [ showModal, setShowModal ] = useState(false);

    let username = '';
    if (isAuth) {
        const token = localStorage.getItem('token');
        const decodedToken = jwtDecode(token);
        username = decodedToken.login;
    } 

    useEffect(() => {
        async function fetchData() {
            try {
                const likeResponse = await getPostLike(props.id);
                const categoriesResponse = await getCategories();
                const categories = categoriesResponse.data;

                const postCategories = props.category.map(categoryName => {
                    return categories.filter(category => category.title === categoryName.trim());
                }).flat();

                setLikes(likeResponse.data.likes || []);
                setDislikes(likeResponse.data.dislikes || []);
                setPostCategories(postCategories);
            } catch (e) {
                console.log(e);
            }
        }
        fetchData();
    }, [props.id, props.category]);

    const updateRating = useCallback(async (action) => {
        try {
            const userLike = likes.find(like => like.login === username);
            const userDislike = dislikes.find(dislike => dislike.login === username);
    
            if (action === 'like') {
                if (userDislike) {
                    await deletePostLike(props.id);
                    setDislikes(prevDislikes => prevDislikes.filter(dislike => dislike.login !== username));
                    setRating(prevRating => prevRating + 1);
                }
                if (!userLike) {
                    await setPostLike(props.id);
                    setLikes(prevLikes => [...prevLikes, { id: 1, post_id: props.id, dislike: 0, count: 1, login: username }]);
                    setRating(prevRating => prevRating + 1);
                } else {
                    await deletePostLike(props.id);
                    setLikes(prevLikes => prevLikes.filter(like => like.login !== username));
                    setRating(prevRating => prevRating - 1);
                }
                props.onUpdate();
            } else if (action === 'dislike') {
                if (userLike) {
                    await deletePostLike(props.id);
                    setLikes(prevLikes => prevLikes.filter(like => like.login !== username));
                    setRating(prevRating => prevRating - 1);
                }
                if (!userDislike) {
                    await setPostDislike(props.id);
                    setDislikes(prevDislikes => [...prevDislikes, { id: 1, post_id: props.id, dislike: 1, count: 1, login: username }]);
                    setRating(prevRating => prevRating - 1);
                } else {
                    await deletePostLike(props.id);
                    setDislikes(prevDislikes => prevDislikes.filter(dislike => dislike.login !== username));
                    setRating(prevRating => prevRating + 1);
                }
                props.onUpdate();
            }
        } catch (e) {
            console.error(e);
        }
    }, [props.id, rating, likes, dislikes, username]);
    
    const openModal = () => {
        setShowModal(true);
    }

    const confirmDelete = async () => {
        try {
            await deletePost(props.id);
            window.location.reload();
        } catch (e) {
            console.error(e);
        }
    }

    const cancelDelete = () => {
        setShowModal(false);
    }

    return (
        <div className={postClass}>
            {showModal && 
                <div className={'modal'}>
                    <div className={'modal-content'}>
                        <h2>Are you shure?</h2>
                        <br></br>
                        <button onClick={confirmDelete} className={'delete-button'}>Delete</button>
                        <button onClick={cancelDelete} className={'cancel-button'}>Cancel</button>
                    </div>
                </div>
            }
            <div className={'post-page-header'}>
                <div className={'post-page-title'}>
                    <Link className={'post-page-title-link'} to={`/posts/${props.id}`}>{props.title}</Link>
                </div>
                <div className={'post-page-info'}>
                    <div className={'post-page-owner'}>Post by <Link className={'post-page-owner-link'} to={`/users/${props.owner_id}`}>{props.owner}</Link></div>
                    <div className={'post-page-date'}>{new Date(props.date).toUTCString()}</div>
                    <div className={'post-page-category'}>
                        {postCategories ? postCategories.map((category, index) =>
                            category ? <Link to={`/categories/${category.id}`} key={index} className={'post-page-category-span'}>{category.title}</Link> : null
                        ) : ''}
                    </div>
                </div>
            </div>
            <div className={'post-page-body-div'}>
                <div className={'post-page-content'}>{props.content}</div>
            </div>
            <div className={'post-page-buttons'}>
                <div className={`post-page-rating-div ${props.isUser ? 'full-width' : ''}`}>
                    {props.isUser ?
                        <div className={'update-buttons'}>
                            <button className={'delete-button'} onClick={openModal}>Delete</button>
                            <button className={'edit-button'}><Link className={'edit-link'} to={`/changePost/${props.id}`}>Change</Link></button>
                        </div> : ''
                    }
                    <button onClick={() => updateRating('like')} className={likes.some(like => like.login === username) 
                        ? 'like-button-active' : 'like-button'}>
                            Like
                    </button>
                    <div className={'rating'}>{rating}</div>
                    <button onClick={() => updateRating('dislike')} className={dislikes.some(dislike => dislike.login === username) 
                        ? 'dislike-button-active' : 'dislike-button'}>
                            Dislike
                    </button>
                </div>   
            </div>
        </div>
    );
}

export default Post;