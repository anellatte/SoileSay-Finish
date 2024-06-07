import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { updateUserProfile, getUserProfile } from '../api';
import { Container, Form, Button, Row, Col, Image, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Profile = () => {
    const location = useLocation();
    const { username: initialUsername, email: initialEmail, avatar: initialAvatar } = location.state || {};
    const [username, setUsername] = useState(initialUsername);
    const [email, setEmail] = useState(initialEmail);
    const [avatar, setAvatar] = useState(initialAvatar ? `http://localhost:8000/${initialAvatar}` : './images/Avatar.png');
    const [selectedFile, setSelectedFile] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertVariant, setAlertVariant] = useState('success');
    const [levels, setLevels] = useState({ taldaLevel: 1, SJlevel: 1, maqalLevel: 1 });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await getUserProfile();
                setAvatar(userData.avatar ? `http://localhost:8000/${userData.avatar}` : './images/Avatar.png');
                setUsername(userData.username);
                setEmail(userData.email);
                setLevels({
                    taldaLevel: userData.taldaLevel,
                    SJlevel: userData.SJlevel,
                    maqalLevel: userData.maqalLevel,
                });
            } catch (error) {
                console.error('Error fetching user profile', error);
            }
        };

        fetchUserData();
    }, []);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = {
            username,
            email,
            avatar: selectedFile,
        };

        try {
            const updatedUser = await updateUserProfile(userData);
            setAvatar(`http://localhost:8000/${updatedUser.avatar}`);
            setUsername(updatedUser.username);
            setEmail(updatedUser.email);
            setAlertMessage('Profile updated successfully!');
            setAlertVariant('success');
        } catch (error) {
            console.error('Error updating profile', error);
            let errorMessage = 'Failed to update profile. Please try again.';
            if (error.response?.data?.msg === 'Error: Images Only!') {
                errorMessage = 'Inappropriate file type. Please upload a JPEG, JPG, PNG, or GIF image.';
            }
            setAlertMessage(errorMessage);
            setAlertVariant('danger');
        }
    };

    return (
        <Container className="profile content__body">
            <div className='container'>
                <div className='profile__inner'>
                    <h2 className="profile__title title">MY PROFILE</h2>

                    <div className="profile__settings">
                        <div className="profile-photo_settings">
                            <h3 className="profile__username">Change Photo:</h3>
                            <Image src={avatar} roundedCircle className="profile__avatar mb-3" />
                            <Form.Group controlId="formFile" className="mb-3">
                                <Form.Control
                                    type="file"
                                    onChange={handleFileChange}
                                />
                            </Form.Group>
                        </div>

                        <div className="profile-username_settings">
                            <Form.Group controlId="formUsername">
                                <h3 className="profile__username">Change Username:</h3>
                                <Form.Control
                                    type="text"
                                    placeholder="Change Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="profile-username__input"
                                />
                                <Form onSubmit={handleSubmit}>
                                    <div className="d-flex justify-content-center mt-4">
                                        <Button variant="primary" type="submit">Update Profile</Button>
                                    </div>
                                </Form>
                            </Form.Group>
                        </div>
                    </div>

                    {alertMessage && (
                        <Alert variant={alertVariant} onClose={() => setAlertMessage('')} dismissible>
                            {alertMessage}
                        </Alert>
                    )}

                    <div className="profile__details mb-3">
                        <h3 className="text-center">Profile Information</h3>
                        <div className="profile__info">
                            <p className="profile__email"><strong>Email:</strong> {email}</p>
                            <p className="profile__level"><strong>Talda Level:</strong> {levels.taldaLevel}</p>
                            <p className="profile__level"><strong>Suraq Jauap Level:</strong> {levels.SJlevel}</p>
                            <p className="profile__level"><strong>Maqal Level:</strong> {levels.maqalLevel}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default Profile;
