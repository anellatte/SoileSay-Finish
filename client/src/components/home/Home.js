import React, { useState, useEffect } from 'react';
import { getAllNews } from '../admin/api';
import { Card, Container, Row, Col } from 'react-bootstrap';

const Home = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const fetchedPosts = await getAllNews();
                setPosts(fetchedPosts);
            } catch (error) {
                console.error('Error fetching news:', error);
            }
        };
        fetchPosts();
    }, []);

    return (
        <Container className='home content__body'>
            <div className='container'>
                <div className='home__inner'>
                    <h1 className='home__title title'>HOME</h1>
                    {posts.map(post => (
                        <Row key={post._id} className="mb-4">
                            <Col>
                                <Card>
                                    <Card.Img variant="top" src={`http://localhost:8000/uploads/${post.image}`} alt="Post" />
                                    <Card.Body>
                                        <Card.Title>{post.title}</Card.Title>
                                        <Card.Text>{post.message}</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    ))}
                </div>
            </div>
        </Container>
    );
};

export default Home;
