import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile } from '../api';

const Account = ({ username, email, avatar, onLogout }) => {
    const navigate = useNavigate();
    const [currentUsername, setCurrentUsername] = useState(username);
    const [currentEmail, setCurrentEmail] = useState(email);
    const [currentAvatar, setCurrentAvatar] = useState(avatar);

    useEffect(() => {
        setCurrentUsername(username);
        setCurrentEmail(email);
        setCurrentAvatar(avatar);
    }, [username, email, avatar]);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const userProfile = await getUserProfile();
                setCurrentUsername(userProfile.username);
                setCurrentEmail(userProfile.email);
                setCurrentAvatar(userProfile.avatar);
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        fetchUserProfile();
    }, []);

    async function submit(e) {
        e.preventDefault();
        onLogout();
        navigate("/");
    }

    return (
        <div className="content__right">
            <div className="account">
                <div className="account__inner">
                    <img className="account__avatar" src={currentAvatar ? `http://localhost:8000/${currentAvatar}` : "./images/AvatarDefault.png"} alt="User Avatar" />
                    <h3 className="account__username">{currentUsername}</h3>
                    <p className="account__email">{currentEmail}</p>
                    <div className="account__buttons">
                        <button className="button__profile" onClick={() => navigate("/profile", { state: { username: currentUsername, email: currentEmail, avatar: currentAvatar } })}>
                            My Profile
                        </button>
                        <button className="button_logout button" onClick={submit}>
                            Log Out
                        </button>
                    </div>
                </div>
            </div>
            <div className='contactus'>
                <div className='contactus__inner'>
                    <h2 className='contactus__title'>CONTACT US</h2>
                    <p className='contactus__text'>@anellatte</p>
                    <p className='contactus__text'>@turashbayeva_jr</p>
                    <p className='contactus__text'>@fvrbloom</p>
                </div>
            </div>
        </div>
    );
};

export default Account;
