import $api from "./index";

export const createComments = (id, comment) => {
    return $api.post(`/posts/${id}/comments`, comment);
}

export const getCommentLike = (id) => {
    return $api.get(`/comments/${id}/like`);
}

export const setCommentLike = (id) => {
    return $api.post(`/comments/${id}/like`);
}

export const setCommentDislike = (id) => {
    return $api.post(`/comments/${id}/dislike`);
}

export const deleteCommentLike = (id) => {
    return $api.delete(`/comments/${id}/like`);
}

export const deleteComment = (id) => {
    return $api.delete(`/comments/${id}`);
}