import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { deleteCommentLike, setCommentLike, setCommentDislike, getCommentLike, deleteComment } from "../../api/comment";
import './comments.css';
import '../posts/post.css'

function Comment(props) {
    const [ rating, setRating ] = useState(props.rating);
    const [ likes, setLikes ] = useState([]);
    const [ dislikes, setDislikes ] = useState([]);
    const [ showModal, setShowModal ] = useState(false);
    const isAuth = useSelector(state => state.auth.authorizationStatus)

    let username = '';
    if (isAuth) {
        const token = localStorage.getItem('token');
        const decodedToken = jwtDecode(token);
        username = decodedToken.login;
    }  

    useEffect(() => {
        async function fetchData() {
            try {
                const likeResponse = await getCommentLike(props.id);
                setLikes(likeResponse.data.likes || []);
                setDislikes(likeResponse.data.dislikes || []);
            } catch (e) {
                console.log(e);
            }
        }
        fetchData();
    }, [props.id]);

    const updateRating = useCallback(async (action) => {
        try {
            const userLike = likes.find(like => like.login === username);
            const userDislike = dislikes.find(dislike => dislike.login === username);
    
            if (action === 'like') {
                if (userDislike) {
                    await deleteCommentLike(props.id);
                    setDislikes(prevDislikes => prevDislikes.filter(dislike => dislike.login !== username));
                    setRating(prevRating => prevRating + 1);
                }
                if (!userLike) {
                    await setCommentLike(props.id);
                    setLikes(prevLikes => [...prevLikes, { id: 1, comment_id: props.id, dislike: 0, count: 1, login: username }]);
                    setRating(prevRating => prevRating + 1);
                } else {
                    await deleteCommentLike(props.id);
                    setLikes(prevLikes => prevLikes.filter(like => like.login !== username));
                    setRating(prevRating => prevRating - 1);
                }
            } else if (action === 'dislike') {
                if (userLike) {
                    await deleteCommentLike(props.id);
                    setLikes(prevLikes => prevLikes.filter(like => like.login !== username));
                    setRating(prevRating => prevRating - 1);
                }
                if (!userDislike) {
                    await setCommentDislike(props.id);
                    setDislikes(prevDislikes => [...prevDislikes, { id: 1, comment_id: props.id, dislike: 1, count: 1, login: username }]);
                    setRating(prevRating => prevRating - 1);
                } else {
                    await deleteCommentLike(props.id);
                    setDislikes(prevDislikes => prevDislikes.filter(dislike => dislike.login !== username));
                    setRating(prevRating => prevRating + 1);
                }
            }
        } catch (e) {
            console.error(e);
        }
    }, [props.id, likes, dislikes, username]);    

    const openModal = () => {
        setShowModal(true);
    }

    const confirmDelete = async () => {
        try {
            await deleteComment(props.id);
        } catch (e) {
            console.error(e);
        }
    }

    const cancelDelete = () => {
        setShowModal(false);
    }

    return (
        <div className={'comment-global'} key={props.id}>
            {showModal && 
                <div className={`modal comment-modal`}>
                    <div className={'modal-content comment-modal-content'}>
                        <h2>Are you shure?</h2>
                        <button onClick={confirmDelete} className={'delete-button'}>Delete</button>
                        <button onClick={cancelDelete} className={'cancel-button cancel-comment'}>Cancel</button>
                    </div>
                </div>
            }
            <div className={'comment-content-div'}>
                <div><Link to={`/users/${props.owner_id}`} className={'comment-owner-link'}>{props.owner}</Link></div>
                <div className={'comment-content'}>{props.content}</div>
            </div>
            <div className={'comments-buttons'}>
                <div className={'date'}>{new Date(props.date).toUTCString()}</div>
                <button onClick={() => updateRating('like')} className={likes.some(like => like.login === username) 
                    ? 'like-button-comment-active' : 'like-button-comment'}>
                        Like
                </button>
                <div className={'rating'}>{rating}</div>
                <button onClick={() => updateRating('dislike')} className={dislikes.some(dislike => dislike.login === username) 
                    ? 'dislike-button-comment-active' : 'dislike-button-comment'}>
                        Dislike
                </button>
                {props.owner === username ?
                    <div className={'actions-buttons-comment'}>
                        <button className={'delete-button comment-delete-button'} onClick={openModal}>Delete</button> 
                    </div> : ''
                }
            </div>
        </div>
    );
}

export default Comment;