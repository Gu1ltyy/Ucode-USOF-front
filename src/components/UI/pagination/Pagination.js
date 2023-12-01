import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { getPosts } from "../../../api/post";
import './pagination.css';

function Pagination(props) {
    const [ pagination, setPagination ] = useState([]);
    const [ searchParams, setSearchParams ] = useSearchParams();
    const [ pages, setPages ] = useState(2);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await getPosts(searchParams.toString());
                setPages(response.data[0].pages);
            } catch (e) {
                console.log(e);
            }
        }
        
        fetchData();
    }, []);

    useEffect(() => {
        const arr = Array.from({length: pages}, (_, i) => i + 1);
        setPagination(arr);
    }, [searchParams, pages]);

    const click = useCallback((e) => {
        searchParams.set('page', e.target.value)
        setSearchParams(searchParams);
    }, [searchParams, setSearchParams]);

    return (
        <div className={'pagination'}>
            {pagination.map(page =>
                <button className={'pagination-button'} onClick={click} value={page} key={page}>{page}</button>
            )}
        </div>
    );
}

export default Pagination;