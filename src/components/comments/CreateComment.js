import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { createComments } from "../../api/comment";
import './comments.css';

function CreateComment() {
    const dispatch = useDispatch();
    const isAuth = useSelector(state => state.auth.authorizationStatus);

    const [createComment, setCreateComment] = useState({content: ''});
    const { postId } = useParams()

    useEffect(() => {
        const authStatus = localStorage.getItem('isAuth') === 'true' ? "LOG_IN" : "LOG_OUT";
        dispatch({type: authStatus});
    },[dispatch]);

    async function click() {
        if (createComment.content.trim()) {
            const response = await createComments(postId, createComment);
            setCreateComment({content: ''});
        }
    }

    if (isAuth) {
        return (
            <div>
                <textarea
                    name={'content'}
                    className={'create-comment'}
                    cols={30}
                    rows={10}
                    value={createComment.content}
                    placeholder="Post your comment now"
                    onChange={e => setCreateComment({...createComment, content: e.target.value})}
                />
                <button className={'comment-button'} onClick={click}>Send</button>
            </div>
        );
    }
}

export default CreateComment;