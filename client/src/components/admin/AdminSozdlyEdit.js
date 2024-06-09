import React, { useState, useEffect } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { getSozdlyById, editSozdly } from './api';
import { useNavigate, useParams } from 'react-router-dom';

const AdminSozdlyEdit = () => {
    const [word, setWord] = useState('');
    const [level, setLevel] = useState(null); // Добавлено состояние для уровня
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSozdly = async () => {
            try {
                const sozdly = await getSozdlyById(id);
                setWord(sozdly.word);
                setLevel(sozdly.level); // Сохранение уровня
            } catch (error) {
                console.error('Error fetching sozdly:', error);
            }
        };
        fetchSozdly();
    }, [id]);

    const handleWordChange = (event) => {
        setWord(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await editSozdly(id, { word, level }); // Использование текущего уровня
            navigate('/admin/sozdly');
        } catch (error) {
            console.error('Error editing sozdly:', error);
        }
    };

    return (
        <Container className='admin content__body'>
            <div className='admin__inner'>
                <h2 className="admin__title title">EDIT SOZDLY</h2>
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
                        
                    </Form.Group>
                    <Button variant="primary" type="submit">Save Changes</Button>
                </Form>
            </div>
        </Container>
    );
};

export default AdminSozdlyEdit;
