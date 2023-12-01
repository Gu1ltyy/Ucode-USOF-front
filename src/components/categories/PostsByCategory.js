import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCategoryById, getPostByCategoryId } from "../../api/category";
import Post from "../posts/Post";
import Header from "../UI/header/Header";
import Footer from "../UI/footer/Footer";
import './categories.css';

function PostsByCategory() {
    const { categoryId } = useParams();
    const [ posts, setPosts ] = useState([]);
    const [ categoryTitle, setCategoryName ] = useState('');

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await getPostByCategoryId(categoryId);
                const categoryResponse = await getCategoryById(categoryId);
                setPosts(response.data);
                setCategoryName(categoryResponse.data[0].title);
            } catch (e) {
                console.log(e);
            }
        }
        fetchData();
    }, [categoryId]);    

    return (
        <div>
            <Header/>
            <div className={'category-posts-container'}>
                <h1 className={'category-title'}>Posts in Category {categoryTitle}</h1>
                <div className={'posts-container'}>
                    {posts.length > 0 ? posts.map(post =>
                        <Post key={post.id} 
                            title={post.title} 
                            owner={post.owner} 
                            content={post.content} 
                            date={post.date} 
                            category={post.categories.split(',')} 
                            rating={post.rating}
                            id={post.id}
                            edited={post.edited}
                            owner_id={post.owner_id}
                        />
                    ) : ''}
                </div>
                <div className={'last-phrase'}>That's all</div>
            </div>
            <Footer/>
        </div>
    );
}

export default PostsByCategory;