import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Pagination from "../UI/pagination/Pagination";
import { getPosts } from "../../api/post";
import Post from "./Post";
import Header from "../UI/header/Header";
import Footer from "../UI/footer/Footer";
import './posts.css';
import '../categories/categories.css';
import '../user/user.css';

const options = [
    { label: "rating up", value: "rating-ASC" },
    { label: "rating down", value: "rating-DESC" },
    { label: "date up", value: "date-ASC" },
    { label: "date down", value: "date-DESC" },
];

function Posts() {
    const [ posts, setPosts ] = useState([]);
    const [ searchParams, setSearchParams ] = useSearchParams();
    const [ startDate, setStartDate ] = useState('');
    const [ endDate, setEndDate ] = useState('');
    const [ sort, setSort ] = useState('');
    const isAuth = useSelector(state => state.auth.authorizationStatus)

    useEffect( () => {
        if (!searchParams.has('page')) {
            setSearchParams({page: '1'})
        }
        const fetchData = async () => {
            try {
                const response = await getPosts(searchParams.toString());
                setPosts(response.data);
            } catch (error) {
                console.log(error);
            }
        };
    
        fetchData();
    }, [searchParams]);

    const updateSearchParams = (key, value) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        setSearchParams(newParams);
    };
    
    const stopDate = () => updateSearchParams('date');
    
    const setDateFilter = () => {
        if (startDate && endDate) {
            updateSearchParams('date', `${startDate}-${endDate}`);
        }
    };    
    
    const sorting = () => {
        if (sort) {
            updateSearchParams('sort', sort);
        }
    };

    return (
        <div>
            <Header/>
            <div className={'profile-global-container'}>
                <div className={'post-filters'}>
                    <div className={'sort'}>
                        <label className={'sort-label'}>Sort </label>
                        <select onChange={e => setSort(e.target.value)}>
                            {options.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <button className={'sort-button'} onClick={sorting}>Set</button>
                    </div>
                    <div className={'date-filter'}>
                        <label>From </label>
                        <input type="date" onChange={e => setStartDate(e.target.value)}/>
                        <label>To </label>
                        <input type="date" onChange={e => setEndDate(e.target.value)}/>
                        <button className={'date-filter-button'} onClick={setDateFilter}>Set</button>
                    </div>
                    {searchParams.has('date') && (
                        <button className={'clear-button'} onClick={stopDate}>
                            Clear
                        </button>
                    )}
                </div>
                <div className={'posts-container'}>
                    {searchParams.has('date') || searchParams.has('search') ? (
                        <h1 className={'category-title'}>
                            Results by{' '}
                            {searchParams.has('date') && (
                                <span className={'search-param'}>
                                    {searchParams.get('date')}
                                </span>
                            )}
                            {searchParams.has('search') && (
                                <span className={'search-param'}>
                                    {searchParams.get('search')}
                                </span>
                            )}
                        </h1>
                    ) : (
                        <h1 className={'category-title'}>All Posts</h1>
                    )}
                    {isAuth && <Link className={'create-post-link'} to={'/createPost'}>Create new post</Link>}
                    {posts.length > 0 ? posts.map(post =>
                            <Post key={post.id}
                                className="post-page-container posts-page-post post" 
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
                        ) : <div className={'last-phrase'}>That's all</div>}
                    <Pagination/>
                </div>
            </div>
            <Footer/>
        </div>
    );
}

export default Posts;