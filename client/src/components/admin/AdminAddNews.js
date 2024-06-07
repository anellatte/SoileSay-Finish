import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addNews } from './api';
import { Form, Button, Container } from 'react-bootstrap';

const AdminAddNews = () => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [image, setImage] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('message', message);
        if (image) {
            formData.append('image', image);
        }

        try {
            await addNews(formData);
            navigate('/admin');
        } catch (error) {
            console.error('Error adding news:', error);
        }
    };

    return (
        <Container className='admin content__body'>
            <div className='admin__inner'>
            <h2 className="admin__title title">ADD NEWS</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="title">
                    <Form.Label className='admin__subtitle'>Title</Form.Label>
                    <Form.Control
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter news title"
                    />
                </Form.Group>

                <Form.Group controlId="message">
                    <Form.Label className='admin__subtitle'>Message</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Enter news message"
                    />
                </Form.Group>

                <Form.Group controlId="image">
                    <Form.Label className='admin__subtitle'>Image</Form.Label>
                    <Form.Control
                        type="file"
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="mt-3">
                    Add News
                </Button>
            </Form>
            </div>
        </Container>
    );
};

export default AdminAddNews;
