import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api', // Adjust if necessary
});

// Add a request interceptor to include the token
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// News API calls
export const getAllNews = async () => {
    try {
        const response = await api.get('/post');
        return response.data.posts;
    } catch (error) {
        console.error('Error fetching news:', error);
        throw error;
    }
};

export const getNewsById = async (id) => {
    try {
        const response = await api.get(`/post/${id}`);
        return response.data.post;
    } catch (error) {
        console.error('Error fetching news by ID:', error);
        throw error;
    }
};

export const addNews = async (newsData) => {
    try {
        const formData = new FormData();
        formData.append('title', newsData.get('title'));
        formData.append('message', newsData.get('message'));
        formData.append('image', newsData.get('image'));

        const response = await api.post('/post/add', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error adding news:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const editNews = async (id, newsData) => {
    try {
        const formData = new FormData();
        formData.append('title', newsData.title);
        formData.append('message', newsData.message);
        if (newsData.image) {
            formData.append('image', newsData.image);
        }

        const response = await api.post(`/post/edit/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating news:', error);
        throw error;
    }
};

export const deleteNews = async (id) => {
    try {
        const response = await api.delete(`/post/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting news:', error);
        throw error;
    }
};

// Talda API calls

export const getAllTalda = async () => {
    try {
        const response = await api.get('/talda/all'); // Ensure this endpoint is correct
        return response.data;
    } catch (error) {
        console.error('Error fetching talda:', error);
        throw error;
    }
};

export const addTalda = async (taldaData) => {
    try {
        const response = await api.post('/talda', taldaData);
        return response.data;
    } catch (error) {
        console.error('Error adding talda:', error);
        throw error;
    }
};

export const getTaldaById = async (id) => {
    try {
        const response = await api.get(`/talda/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching talda by ID:', error);
        throw error;
    }
};

export const editTalda = async (id, taldaData) => {
    try {
        const response = await api.put(`/talda/${id}`, taldaData);
        return response.data;
    } catch (error) {
        console.error('Error updating talda:', error);
        throw error;
    }
};

export const deleteTalda = async (id) => {
    try {
        const response = await api.delete(`/talda/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting talda:', error);
        throw error;
    }
};

// SuraqJauap API calls

export const getAllSuraqJauap = async () => {
    try {
        const response = await api.get('/sj/all'); // Ensure this endpoint is correct
        return response.data;
    } catch (error) {
        console.error('Error fetching SuraqJauap:', error);
        throw error;
    }
};

export const addSuraqJauap = async (suraqJauapData) => {
    try {
        const response = await api.post('/sj', suraqJauapData);
        return response.data;
    } catch (error) {
        console.error('Error adding SuraqJauap:', error);
        throw error;
    }
};

export const getSuraqJauapById = async (id) => {
    try {
        const response = await api.get(`/sj/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching SuraqJauap by ID:', error);
        throw error;
    }
};

export const editSuraqJauap = async (id, suraqJauapData) => {
    try {
        const response = await api.put(`/sj/${id}`, suraqJauapData);
        return response.data;
    } catch (error) {
        console.error('Error updating SuraqJauap:', error);
        throw error;
    }
};

export const deleteSuraqJauap = async (id) => {
    try {
        const response = await api.delete(`/sj/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting SuraqJauap:', error);
        throw error;
    }
};


export default api;
