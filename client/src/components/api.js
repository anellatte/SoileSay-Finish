import axios from 'axios';

const BASE_URL = "http://localhost:8000";

// Function to get the token from localStorage
const getToken = () => localStorage.getItem('token');

// User Authentication

export const signIn = async (email, password) => {
    try {
        const res = await axios.post(`${BASE_URL}/login`, { email, password });
        console.log(`Response data:`, res.data); // Log response data
        const token = res.data.token;
        if (token) {
            localStorage.setItem('token', token); // Store the token in localStorage
            console.log('Token stored:', localStorage.getItem('token')); // Verify the token is stored correctly
        }
        return res.data;
    } catch (error) {
        console.error("Error signing in:", error);
        throw error;
    }
};

export const signUp = async (username, email, password) => {
    try {
        const res = await axios.post(`${BASE_URL}/signup`, { username, email, password });
        const token = res.data.token;
        if (token) {
            localStorage.setItem('token', token); // Store the token in localStorage
            console.log('Token stored:', localStorage.getItem('token')); // Verify the token is stored correctly
        }
        return res.data;
    } catch (error) {
        console.error("Error signing up:", error);
        throw error;
    }
};

export const getUserProfile = async () => {
    try {
        const token = getToken(); // Get the token from localStorage
        if (!token) {
            throw new Error('No token found'); // Ensure token is available
        }
        console.log('Using token:', token); // Log the token to check if it's retrieved correctly

        const response = await axios.get(`${BASE_URL}/api/profile`, {
            headers: {
                'Authorization': `Bearer ${token}` // Include the token in the request headers
            }
        });

        console.log('Fetched user profile:', response.data); // Add this line
        return response.data;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
};

export const updateUserProfile = async (userData) => {
    try {
        const formData = new FormData();
        formData.append('avatar', userData.avatar);
        formData.append('username', userData.username);
        formData.append('email', userData.email);

        const token = getToken(); // Get the token from localStorage
        if (!token) {
            throw new Error('No token found'); // Ensure token is available
        }
        console.log('Using token:', token); // Log the token to check if it's retrieved correctly

        const response = await axios.post(`${BASE_URL}/api/profile/updateProfile`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}` // Include the token in the request headers
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error updating profile:', error.response ? error.response.data : error.message); // Log more detailed error info
        throw error;
    }
};

// Talda API calls
// Talda API calls

export const getTaldaByLevel = async (level) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/profile/level`, {
            params: { level },
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });
        console.log(`Fetched talda data for level ${level}:`, response.data);
        if (!response.data || !response.data.text) {
            return { noData: true }; // Indicate no data found for this level
        }
        return response.data;
    } catch (error) {
        console.error('Error fetching talda by level:', error);
        if (error.response && error.response.status === 404) {
            return { noData: true }; // Handle 404 error
        }
        return { error: true }; // Indicate an error occurred
    }
};

export const getCompletedTalda = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/api/profile/completed`, {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching completed talda:', error);
        throw error;
    }
};

export const updateTaldaLevel = async (currentLevel) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/profile/updateLevel`, { level: currentLevel }, {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating talda level:', error);
        return { message: 'Error', taldaLevel: null };
    }
};


// SuraqJauap API calls

// SuraqJauap API calls

// Get SuraqJauap level by specific level number
export const getSuraqJauapByLevel = async (level) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/profile/sjlevel`, {
            params: { level: Number(level) },
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });
        console.log(`Fetched SuraqJauap data for level ${level}:`, response.data);
        if (!response.data || !response.data.text) {
            return { noData: true }; // Indicate no data found for this level
        }
        return response.data;
    } catch (error) {
        console.error('Error fetching SuraqJauap by level:', error);
        if (error.response && error.response.status === 404) {
            return { noData: true }; // Handle 404 error
        }
        return { error: true }; // Indicate an error occurred
    }
};

// Get all completed SuraqJauap levels for the current user
export const getCompletedSuraqJauap = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/api/profile/sjcompleted`, {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching completed SuraqJauap levels:', error);
        throw error;
    }
};

// Update the user's SuraqJauap level
export const updateSuraqJauapLevel = async (currentLevel) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/profile/sjupdateLevel`, { level: Number(currentLevel) }, {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating SuraqJauap level:', error);
        return { message: 'Error', suraqJauapLevel: null };
    }
};

