import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllSozdly, deleteSozdly } from './api'; // Adjust the import path if necessary
import { Button, Card, Container, Row, Col } from 'react-bootstrap';

const AdminSozdly = () => {
    const [sozdly, setSozdly] = useState([]);

    useEffect(() => {
        const fetchSozdly = async () => {
            try {
                const fetchedSozdly = await getAllSozdly();
                if (Array.isArray(fetchedSozdly)) {
                    setSozdly(fetchedSozdly);
                } else if (fetchedSozdly) {
                    setSozdly([fetchedSozdly]);
                } else {
                    setSozdly([]);
                }
            } catch (error) {
                console.error('Error fetching sozdly:', error);
                setSozdly([]);
            }
        };
        fetchSozdly();
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteSozdly(id);
            setSozdly(sozdly.filter(sozdly => sozdly._id !== id));
        } catch (error) {
            console.error('Error deleting sozdly:', error);
        }
    };

    return (
        <Container className='admin content__body'>
            <div className='admin__inner'>
                <h2 className="admin__title title">ADMIN SOZDLY</h2>
                <div className="d-flex justify-content-center mb-4">
                    <Link to="/admin/sozdly/add" className="btn btn-primary mb-4">Add Level</Link>
                </div>
                
                <Row>
                    {Array.isArray(sozdly) && sozdly.length > 0 ? (
                        sozdly.map(sozdly => (
                            <Col key={sozdly._id} md={4} className="mb-4">
                                <Card>
                                    <Card.Body>
                                        <Card.Title>Level {sozdly.level}</Card.Title>
                                        <Card.Text>{sozdly.word}</Card.Text>
                                        <Link to={`/admin/sozdly/edit/${sozdly._id}`} className="btn btn-secondary mr-2">Edit</Link>
                                        <Button variant="danger" onClick={() => handleDelete(sozdly._id)}>Delete</Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <p>No sozdly levels found.</p>
                    )}
                </Row>
            </div>
        </Container>
    );
};

export default AdminSozdly;
