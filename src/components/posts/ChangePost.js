import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostById, changePost } from "../../api/post";
import { getCategories } from "../../api/category";
import Header from "../UI/header/Header";
import Footer from "../UI/footer/Footer";
import './createPost.css';

function ChangePost() {
    const { postId } = useParams();
    const [ postData, setPostData ] = useState({});
    const [ checkList, setChecklist ] = useState([]);
    const [ checked, setChecked ] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const postResponse = await getPostById(postId);
                setPostData(postResponse.data);
                const categories = postResponse.data.categories.split(', ');
                setChecked(categories);
            } catch (e) {
                console.error(e);
            }
        }        
        fetchData();
    }, [postId]);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const response = await getCategories();
                let result = [];

                response.data.forEach(item => {
                    result.push(item.title);
                });
                setChecklist(result);
            } catch (e) {
                console.error(e);
            }
        }
        fetchCategories();
    }, []);

    const navigate = useNavigate();

    async function updatePost() {
        try {
            const postToUpdate = { ...postData, categories: checked.join(', ') };
            await changePost(postId, postToUpdate);
            navigate(-1);
        } catch (e) {
            console.error(e);
        }
    }  

    function handleCheck(e) {
        let updatedList = [...checked];
        if (e.target.checked) {
            updatedList = [...checked, e.target.value];
        } else {
            updatedList = updatedList.filter(item => item !== e.target.value);
        }
        setChecked(updatedList);
    }

    return (
        <div>
            <Header />
            <div className={'global-div'}>
                <div className={'create-div'}>
                    <h1 className={'create-h1'}>Modify your post</h1>
                    <label className={'create-label'}>Title</label>
                    <input
                        type={'text'}
                        className={'create-input'}
                        onChange={(e) => setPostData({ ...postData, title: e.target.value })}
                        value={postData.title || ''}
                    />
                    <label className={'create-label'}>Content</label>
                    <textarea
                        name={'content'}
                        className={'create-text'}
                        cols={30}
                        rows={10}
                        onChange={(e) => setPostData({ ...postData, content: e.target.value })}
                        value={postData.content || ''}
                    />
                    <label className={'create-label'}>Categories</label>
                    <div className={'choose-category-div'}>
                        {checkList.map((item, index) => (
                            <div className={'radios'} key={index}>
                                <label>
                                    <input
                                        className={'radio-input'}
                                        value={item}
                                        type="checkbox"
                                        checked={checked.includes(item)}
                                        onChange={handleCheck}
                                    />
                                    <span className={'radio-span'}>{item}</span>
                                </label>
                            </div>
                        ))}
                    </div>
                    <button onClick={updatePost} className={'create-button'}>Update</button>
                </div>
            </div>
            <div className={'create-phrase'}>
                <button className="create-link" onClick={() => navigate(-1)}>Go back</button>
            </div>
            <Footer/>
        </div>
    );
}

export default ChangePost;