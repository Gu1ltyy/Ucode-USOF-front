import $api from "./index";

export const getCategories = () => {
    return $api.get(`/categories`);
}

export const getCategoryById = (id) => {
    return $api.get(`/categories/${id}`);
}

export const getPostByCategoryId = (id) => {
    return $api.get(`/categories/${id}/posts`);
}

export const createCategory = (category) => {
    return $api.post(`/categories`, category);
}