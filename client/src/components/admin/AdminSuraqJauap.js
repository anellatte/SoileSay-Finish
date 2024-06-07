import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllSuraqJauap, deleteSuraqJauap } from './api'; // Adjust the import path if necessary
import { Button, Card, Container, Row, Col } from 'react-bootstrap';

const AdminSuraqJauap = () => {
    const [suraqJauap, setSuraqJauap] = useState([]);

    useEffect(() => {
        const fetchSuraqJauap = async () => {
            try {
                const fetchedSuraqJauap = await getAllSuraqJauap();
                if (Array.isArray(fetchedSuraqJauap)) {
                    setSuraqJauap(fetchedSuraqJauap);
                } else if (fetchedSuraqJauap) {
                    setSuraqJauap([fetchedSuraqJauap]);
                } else {
                    setSuraqJauap([]);
                }
            } catch (error) {
                console.error('Error fetching SuraqJauap:', error);
                setSuraqJauap([]);
            }
        };
        fetchSuraqJauap();
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteSuraqJauap(id);
            setSuraqJauap(suraqJauap.filter(sj => sj._id !== id));
        } catch (error) {
            console.error('Error deleting SuraqJauap:', error);
        }
    };

    return (
        <Container className='admin content__body'>
            <div className='admin__inner'>
                <h2 className="admin__title title">ADMIN SURAQ - JAUAP</h2>
                <div className="d-flex justify-content-center mb-4">
                    <Link to="/admin/sj/add" className="btn btn-primary">Add Level</Link>
                </div>
                <Row>
                    {Array.isArray(suraqJauap) && suraqJauap.length > 0 ? (
                        suraqJauap.map(sj => (
                            <Col key={sj._id} md={4} className="mb-4">
                                <Card>
                                    <Card.Body>
                                        <Card.Title>Level {sj.level}</Card.Title>
                                        <Card.Text>{sj.text}</Card.Text>
                                        <Link to={`/admin/sj/edit/${sj._id}`} className="btn btn-secondary mr-2">Edit</Link>
                                        <Button variant="danger" onClick={() => handleDelete(sj._id)}>Delete</Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <p>No SuraqJauap levels found.</p>
                    )}
                </Row>
            </div>
        </Container>
    );
};

export default AdminSuraqJauap;
