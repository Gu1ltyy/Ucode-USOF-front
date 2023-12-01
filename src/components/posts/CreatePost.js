import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from 'react-router-dom';
import { createPost } from "../../api/post";
import { getCategories } from "../../api/category";
import Header from "../UI/header/Header";
import Footer from "../UI/footer/Footer";
import './createPost.css';

function CreatePost() {
    const dispatch = useDispatch();
    const isAuth = useSelector(state => state.auth.authorizationStatus);
    const [ post, setPost ] = useState({ title: '', content: '' });
    const [ checked, setChecked ] = useState([]);
    const [ checkList, setChecklist ] = useState([])
    const [ isCreate, setIsCreate ] = useState(false);

    useEffect(() => {
        if (localStorage.getItem('isAuth') === 'true') {
            dispatch({type: "LOG_IN"});
        }
        else{
            dispatch({type: "LOG_OUT"});
        }
    },[dispatch]);

    useEffect(() => {
        async function fetchData() {
            const response = await getCategories();
            let result = [];

            response.data.forEach(item => {
                result.push(item.title);
            })
            setChecklist(result);
        }
        fetchData().catch(e => console.log(e));
    }, [])

    const navigate = useNavigate();

    async function click() {
        try {
            const postToCreate = { ...post, categories: post.categories.join(',') };
            const response = await createPost(postToCreate);
            console.log(response);
            setIsCreate(true);
        } catch (e) {
            console.log(e);
        }
    }    

    function handleCheck(e) {
        let updatedList = [...checked];
        if (e.target.checked) {
            updatedList = [...checked, e.target.value];
        } else {
            updatedList.splice(checked.indexOf(e.target.value), 1);
        }
        setChecked(updatedList);
        setPost({...post, categories: updatedList});
    }

    if(isAuth) {
        if(isCreate) {
            return (
                <Navigate to={'/posts'}/>
            );
        }

        return (
            <div>
                <Header/>
                <div className={'global-div'}>
                    <div className={'create-div'}>
                        <h1 className={'create-h1'}>So, what's your post about?</h1>
                        <label className={'create-label'}>Title</label>
                        <input
                            type={'text'}
                            className={'create-input'}
                            onChange={e => setPost({...post, title: e.target.value})}
                            value={post.title}
                        />
                        <label className={'create-label'}>Content</label>
                        <textarea
                            name={'content'}
                            className={'create-text'}
                            cols={30}
                            rows={10}
                            onChange={e => setPost({...post, content: e.target.value})}
                            value={post.content}
                        />
                        <label className={'create-label'}>Categories</label>
                        <div className={'choose-category-div'}>
                            {checkList.map((item, index) => (
                                <div className={'radios'} key={index}>
                                    <label>
                                        <input className={'radio-input'} value={item} type="checkbox" onChange={handleCheck} />
                                        <span className={'radio-span'}>{item}</span>
                                    </label>
                                </div>
                            ))}
                        </div>
                        <button onClick={click} className={'create-button'}>Create</button>
                    </div>
                </div>
                <div className={'create-phrase'}>
                    <button className="create-link" onClick={() => navigate(-1)}>Go back</button>
                </div>
                <Footer/>
            </div>
        );
    } else {
        return (
            <Navigate to={'/posts'}/>
        );
    }
}

export default CreatePost;