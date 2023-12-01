import { useEffect, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { setPostLike, setPostDislike, deletePostLike, getPostById, getComments, getPostLike } from "../../api/post";
import { getCategories } from "../../api/category";
import CreateComment from "../comments/CreateComment";
import Comment from "../comments/Comment";
import Header from "../UI/header/Header";
import Footer from "../UI/footer/Footer";
import './post.css';

function PostPage() {
    const { postId } = useParams();
    const [ post, setPost ] = useState({});
    const [ comments, setComments ] = useState([]);
    const [ rating, setRating ] = useState(0);
    const [ likes, setLikes ] = useState([]);
    const [ dislikes, setDislikes ] = useState([]);
    const [ postCategories, setPostCategories ] = useState([]);
    const isAuth = useSelector(state => state.auth.authorizationStatus)

    let username = '';
    if (isAuth) {
        const token = localStorage.getItem('token');
        const decodedToken = jwtDecode(token);
        username = decodedToken.login;
    }  
  
    const updateRating = useCallback(async (action) => {
        try {
            const userLike = likes.find(like => like.login === username);
            const userDislike = dislikes.find(dislike => dislike.login === username);
    
            if (action === 'like') {
                if (userDislike) {
                    await deletePostLike(postId);
                    setDislikes(dislikes.filter(dislike => dislike.login !== username));
                    setRating(rating + 1);
                }
                if (!userLike) {
                    await setPostLike(postId);
                    setLikes([...likes, { id: 1, post_id: postId, dislike: 0, count: 1, login: username }]);
                    setRating(rating + 1);
                } else {
                    await deletePostLike(postId);
                    setLikes(likes.filter(like => like.login !== username));
                    setRating(rating - 1);
                }
            } else if (action === 'dislike') {
                if (userLike) {
                    await deletePostLike(postId);
                    setLikes(likes.filter(like => like.login !== username));
                    setRating(rating - 1);
                }
                if (!userDislike) {
                    await setPostDislike(postId);
                    setDislikes([...dislikes, { id: 1, post_id: postId, dislike: 1, count: 1, login: username }]);
                    setRating(rating - 1);
                } else {
                    await deletePostLike(postId);
                    setDislikes(dislikes.filter(dislike => dislike.login !== username));
                    setRating(rating + 1);
                }
            }
        } catch (e) {
            console.error(e);
        }
    }, [postId, rating, likes, dislikes, username]);
  
    useEffect(() => {
        async function fetchData() {
            try {
                const postResponse = await getPostById(postId);
                const likeResponse = await getPostLike(postId);
                const commentsResponse = await getComments(postId);
                const categoriesResponse = await getCategories();
                const categories = categoriesResponse.data;
    
                const postCategories = postResponse.data.categories.split(',').map(categoryName => {
                    return categories.filter(category => category.title === categoryName.trim());
                }).flat();
    
                setPost(postResponse.data);
                setComments(commentsResponse.data);
                setLikes(likeResponse.data.likes || []);
                setDislikes(likeResponse.data.dislikes || []);
                setRating(postResponse.data.rating);
                setPostCategories(postCategories);
            } catch (e) {
                console.log(e);
            }
        }
        fetchData();
    }, [postId, comments]);    
  
    return (
        <div>
            <Header/>
            <div className={'post-page-container'}>
                <div className={'post-page-header'}>
                    <h1 className={'post-page-title'}>{post.title}</h1>
                    <div className={'post-page-info'}>
                        <div className={'post-page-owner'}>Post by <Link className={'post-page-owner-link'} to={`/users/${post.owner_id}`}>{post.owner}</Link></div>
                        <div className={'post-page-date'}>{new Date(post.date).toUTCString()}</div>
                        <div className={'post-page-category'}>
                            {postCategories ? postCategories.map((category, index) =>
                                category ? <Link to={`/categories/${category.id}`} key={index} className={'post-page-category-span'}>{category.title}</Link> : null
                            ) : ''}
                        </div>
                        {post.edited == true && <div className={'post-page-edited'}>Edited</div>}
                    </div>
                </div>
                <div className={'post-page-body-div'}>
                    <div className={'post-page-content'}>{post.content}</div>
                </div>
                <div className={'post-page-buttons'}>
                    <div className={'post-page-rating-div'}>
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
            <div className={'post-page-container comments-container'}>
                <div className={'comments-div'}>
                    <CreateComment/>
                    <div className={'post-page-all-comments'}>All comments {comments.length}</div>
                    <hr></hr>
                    {comments.map(comment =>
                        <Comment
                            key={comment.id}
                            id={comment.id}
                            date={comment.date}
                            rating={comment.rating}
                            content={comment.content}
                            owner={comment.owner}
                            owner_id={comment.owner_id}
                        />
                    )}
                    <div className={'last-phrase'}><div className={'post-page-all-comments last-phrase'}>That's all</div></div>
                </div>
            </div>
            <Footer className={'post-page-footer'}/>
        </div>
    );
}

export default PostPage;