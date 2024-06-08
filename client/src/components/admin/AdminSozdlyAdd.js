import React, { useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { addSozdly } from './api';
import { useNavigate } from 'react-router-dom';

const AdminSozdlyAdd = () => {
    const [word, setWord] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleWordChange = (event) => {
        setWord(event.target.value);
        if (event.target.value.length !== 5) {
            setError('The word must be exactly 5 letters long.');
        } else {
            setError('');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (word.length !== 5) {
            setError('The word must be exactly 5 letters long.');
            return;
        }

        try {
            await addSozdly({ word, level: 1 });
            navigate('/admin/sozdly');
        } catch (error) {
            console.error('Error adding sozdly:', error);
        }
    };

    return (
        <Container className='admin content__body'>
            <div className='admin__inner'>
                <h2 className="admin__title title">ADD SOZDLY</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formWord">
                        <Form.Label>Word</Form.Label>
                        <Form.Control
                            type="text"
                            value={word}
                            onChange={handleWordChange}
                            placeholder="Enter the word"
                            required
                        />
                        {error && <Alert variant="danger" className="mt-2">{error}</Alert>}
                    </Form.Group>
                    <Button variant="primary" type="submit" disabled={!!error}>Add Level</Button>
                </Form>
            </div>
        </Container>
    );
};

export default AdminSozdlyAdd;
