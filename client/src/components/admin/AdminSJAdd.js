import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { addSuraqJauap } from './api';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const AdminSJAdd = () => {
    const [levelText, setLevelText] = useState('');
    const [levelNumber, setLevelNumber] = useState(1);
    const [questions, setQuestions] = useState([{ text: '', options: [{ text: '', isCorrect: false }] }]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleQuestionChange = (index, value) => {
        const newQuestions = [...questions];
        newQuestions[index].text = value;
        setQuestions(newQuestions);
    };

    const handleOptionChange = (qIndex, oIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex].text = value;
        setQuestions(newQuestions);
    };

    const handleCorrectChange = (qIndex, oIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex].isCorrect = value;
        setQuestions(newQuestions);
    };

    const addQuestion = () => {
        setQuestions([...questions, { text: '', options: [{ text: '', isCorrect: false }] }]);
    };

    const addOption = (qIndex) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options.push({ text: '', isCorrect: false });
        setQuestions(newQuestions);
    };

    const deleteOption = (qIndex, oIndex) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options.splice(oIndex, 1);
        setQuestions(newQuestions);
    };

    const deleteQuestion = (qIndex) => {
        const newQuestions = [...questions];
        newQuestions.splice(qIndex, 1);
        setQuestions(newQuestions);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validate questions to ensure each has exactly one correct option
        for (const question of questions) {
            const correctOptions = question.options.filter(option => option.isCorrect);
            if (correctOptions.length !== 1) {
                setError("Each question must have exactly one correct option.");
                return;
            }
        }

        try {
            await addSuraqJauap({
                text: levelText,
                level: levelNumber,
                questions
            });
            navigate('/admin/sj');
        } catch (error) {
            console.error('Error adding SuraqJauap:', error);
        }
    };

    return (
        <Container className='admin content__body'>
            <div className='admin__inner'>
                <h2 className="admin__title title">ADD SURAQ - JAUAP</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formLevelText">
                        <Form.Label className='admin__subtitle'>Level Text</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={5}
                            value={levelText}
                            onChange={(e) => setLevelText(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formLevelNumber">
                        <Form.Label className='admin__subtitle'>Level Number</Form.Label>
                        <Form.Control
                            type="number"
                            value={levelNumber}
                            onChange={(e) => setLevelNumber(parseInt(e.target.value, 10))}
                            required
                        />
                    </Form.Group>
                    {questions.map((question, qIndex) => (
                        <div key={qIndex} className="mb-4">
                            <Form.Group controlId={`formQuestionText${qIndex}`}>
                                <Form.Label className='admin__subtitle'>Question {qIndex + 1}</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={question.text}
                                    onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                                    required
                                />
                                <Button variant="danger" onClick={() => deleteQuestion(qIndex)} className="mt-2 mb-4">
                                    Delete Question
                                </Button>
                            </Form.Group>
                            {question.options.map((option, oIndex) => (
                                <Row key={oIndex} className="mb-2">
                                    <Col md={8}>
                                        <Form.Control
                                            type="text"
                                            placeholder={`Option ${oIndex + 1}`}
                                            value={option.text}
                                            onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                            required
                                        />
                                    </Col>
                                    <Col md={4} className="d-flex align-items-center">
                                        <Form.Check
                                            type="checkbox"
                                            label="Correct"
                                            checked={option.isCorrect}
                                            onChange={(e) => handleCorrectChange(qIndex, oIndex, e.target.checked)}
                                        />
                                        <Button variant="danger" onClick={() => deleteOption(qIndex, oIndex)} size="sm" className="mt-2 admin__btn-delete">
                                            <FontAwesomeIcon icon={faTrashAlt} />
                                        </Button>
                                    </Col>
                                </Row>
                            ))}
                            <Button variant="secondary" onClick={() => addOption(qIndex)}>Add Option</Button>
                        </div>
                    ))}
                    <Button variant="secondary" onClick={addQuestion}>Add Question</Button>
                    <Button variant="primary" type="submit">Add Level</Button>
                </Form>
                {error && <Alert variant="danger" className="mt-4">{error}</Alert>}
            </div>

        </Container>
    );
};

export default AdminSJAdd;
