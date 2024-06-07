import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getNewsById, editNews } from './api';
import { Container } from 'react-bootstrap';

const AdminEditNews = () => {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [image, setImage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const post = await getNewsById(id);
                setTitle(post.title);
                setMessage(post.message);
                if (post.image) {
                    setImage(post.image);
                }
            } catch (error) {
                console.error('Error fetching news:', error);
            }
        };
        fetchPost();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await editNews(id, { title, message, image });
            navigate('/admin');
        } catch (error) {
            console.error('Error updating news:', error);
        }
    };

    return (
        <Container className="admin content__body">
            <div className='admin__inner'>
                <h2 className="admin__title title">EDIT NEWS</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-3">
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            className="form-control"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Title"
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="message">Message</label>
                        <input
                            type="text"
                            className="form-control"
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Message"
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="image">Image</label>
                        <input
                            type="file"
                            className="form-control"
                            id="image"
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Update News</button>
                </form>
            </div>
        </Container>
    );
};

export default AdminEditNews;
