import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import About from "./components/about/About";
import Register from "./components/auth/Register";
import Activate from "./components/auth/Activate";
import Login from "./components/auth/Login";
import Reset from "./components/auth/Reset";
import ResetWithToken from "./components/auth/ResetWithToken";
import Posts from "./components/posts/Posts";
import PostPage from "./components/posts/PostPage";
import User from "./components/user/User";
import CreatePost from "./components/posts/CreatePost";
import ChangePost from "./components/posts/ChangePost";
import Categories from "./components/categories/Categories";
import PostsByCategory from "./components/categories/PostsByCategory";
import NotFoundPage from "./components/404/404";

function App() {
    useEffect(() => {
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.body.style.backgroundColor = '#503A3A';
        document.body.style.position = 'relative';
        document.body.style.minHeight = '100vh';
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Navigate to="/posts" replace />} />
                <Route path='/register' element={<Register/>} />
                <Route path='/activate/:link/:id' element={<Activate/>} />
                <Route path='/login' element={<Login/>} />
                <Route path='/reset' element={<Reset/>} />
                <Route path="/reset/:token" element={<ResetWithToken/>} />
                <Route path='/posts' element={<Posts/>} />
                <Route path='/posts/:postId' element={<PostPage/>} />
                <Route path='/createPost' element={<CreatePost/>} />
                <Route path='/changePost/:postId' element={<ChangePost/>} />
                <Route path='/users/:userId' element={<User/>} />
                <Route path='/categories' element={<Categories/>} />
                <Route path='/categories/:categoryId' element={<PostsByCategory/>} />
                <Route path='/about' element={<About/>} />
                <Route path='/404' element={<NotFoundPage/>} />
                <Route path='*' element={<Navigate to="/404" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;