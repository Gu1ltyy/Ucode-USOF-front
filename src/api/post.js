import $api from "./index";

export const createPost = (post) => {
    return $api.post('/posts', post);
}

export const changePost = (id, post) => {
    return $api.patch(`/posts/${id}`, post);
}

export const deletePost = (id) => {
    return $api.delete(`/posts/${id}`);
}

export const getPosts = (params) => {
    if (!params)
        return $api.get(`/posts?page=1`);

    return $api.get(`/posts?${params}`);
}

export const getPostById = (id) => {
    return $api.get(`/posts/${id}`);
}

export const getComments = (id) => {
    return $api.get(`/posts/${id}/comments`);
}

export const getPostLike = (id) => {
    return $api.get(`/posts/${id}/like`);
}


export const setPostLike = (id) => {
    return $api.post(`/posts/${id}/like`);
}

export const setPostDislike = (id) => {
    return $api.post(`/posts/${id}/dislike`);
}

export const deletePostLike = (id) => {
    return $api.delete(`/posts/${id}/like`);
}