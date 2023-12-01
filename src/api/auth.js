import $api from "./index";

export const register = (user) => {
    return $api.post('/auth/register', user);
}

export const activation = (link, id) => {
    return $api.get(`/auth/activate/${link}/${id}`);
}

export const reset = (email) => {
    return $api.post(`/auth/password-reset`, { email });
}

export const resetWithToken = ({ resetToken, newPassword }) => {
    return $api.post(`/auth/password-reset/${resetToken}`, { resetToken, newPassword });
}

export const login = (user) => {
    return $api.post('/auth/login', user);
}

export const logout = () => {
    return $api.post('/auth/logout');
}

export const checkAuth = async () => {
    try {
        const response = await $api.get('/auth/refresh');
        localStorage.setItem('token', response.data.accessToken);
        return true;
    } catch (e) {
        return false;
    }
}