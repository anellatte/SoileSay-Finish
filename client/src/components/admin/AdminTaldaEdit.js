// src/components/admin/AdminTaldaEdit.js
import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { getTaldaById, editTalda } from './api';
import { useNavigate, useParams } from 'react-router-dom';

const wordTypes = ['Бастауыш', 'Баяндауыш', 'Пысықтауыш', 'Толықтауыш', 'Анықтауыш'];

const AdminTaldaEdit = () => {
    const [numWords, setNumWords] = useState(0);
    const [words, setWords] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTalda = async () => {
            try {
                const talda = await getTaldaById(id);
                const fetchedWords = talda.analysis.map(item => ({ text: item.word, type: item.type }));
                setNumWords(fetchedWords.length);
                setWords(fetchedWords);
            } catch (error) {
                console.error('Error fetching talda:', error);
            }
        };
        fetchTalda();
    }, [id]);

    const handleWordChange = (index, value) => {
        const newWords = [...words];
        newWords[index].text = value;
        setWords(newWords);
    };

    const handleTypeChange = (index, value) => {
        const newWords = [...words];
        newWords[index].type = value;
        setWords(newWords);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const analysis = words.map(word => ({ word: word.text, type: word.type }));
            const sentence = words.map(word => word.text).join(' ');
            await editTalda(id, { text: sentence, analysis, level: 1 });
            navigate('/admin/talda');
        } catch (error) {
            console.error('Error editing talda:', error);
        }
    };

    return (
        <Container className='admin content__body'>
            <div className='admin__inner'>
                <h2 className="admin__title title">EDIT TALDA</h2>
                <Form onSubmit={handleSubmit}>
                    {Array.from({ length: numWords }).map((_, index) => (
                        <Row key={index} className="mb-3">
                            <Col md={6}>
                                <Form.Control
                                    type="text"
                                    placeholder={`Word ${index + 1}`}
                                    value={words[index]?.text || ''}
                                    onChange={(e) => handleWordChange(index, e.target.value)}
                                    required
                                />
                            </Col>
                            <Col md={6}>
                                <Form.Control
                                    as="select"
                                    value={words[index]?.type || ''}
                                    onChange={(e) => handleTypeChange(index, e.target.value)}
                                    required
                                >
                                    <option value="">Select type</option>
                                    {wordTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </Form.Control>
                            </Col>
                        </Row>
                    ))}
                    <Button variant="primary" type="submit">Edit Level</Button>
                </Form>
            </div>
        </Container>
    );
};

export default AdminTaldaEdit;
