import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { createCategory, getCategories } from "../../api/category";
import Header from "../UI/header/Header";
import Footer from "../UI/footer/Footer";
import './categories.css'

function Categories() {
    const [ categories , setCategories] = useState([]);
    const [ val, setVal ] = useState({});
    const [ userRole, setUserRole ] = useState('');

    useEffect(() => {
        const authStatus = localStorage.getItem('token') ? jwtDecode(localStorage.getItem('token')) : {};
        setUserRole(authStatus.role);
    }, []);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await getCategories();
                setCategories(response.data);
            } catch (e) {
                console.log(e);
            }
        }
        
        fetchData();
    }, []);    

    async function click() {
        await createCategory(val);
        setCategories([...categories, val]);
        setVal({});
    }

    return (
        <div>
            <Header/>
            <div className={'categories-container'}>
                <div className={'category-container'}>
                    {categories.map(item => (
                        <div className={'category-div'} key={item.id}>
                            <Link to={`/categories/${item.id}`} className={'category-link'}>
                                <div className={'category'}>
                                    <span className={'category-span'}>{item.title}</span>
                                    <div className={'description'}>{item.description}</div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            {userRole === 'admin' && (
                <div className={'categories-container admin-container'}>
                    <div className={'category-create'}>
                        <h1 className={'category-h1'}>Create Category</h1>
                        <input
                            type={'text'}
                            className={'create-title'}
                            onChange={e => setVal({...val, title: e.target.value})}
                            placeholder={'Title'}
                            value={val.title || ''}
                        />
                        <textarea
                            name={'content'}
                            className={'create-content'}
                            cols={30}
                            rows={10}
                            onChange={e => setVal({...val, description: e.target.value})}
                            placeholder={'Content'}
                            value={val.description || ''}
                        />
                        <button className={'category-create-button'} onClick={click}>Create</button>
                    </div>
                </div>
            )}
            <Footer/>
        </div>
    );
}

export default Categories;