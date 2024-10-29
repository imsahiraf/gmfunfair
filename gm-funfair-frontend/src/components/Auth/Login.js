// src/components/Auth.js
import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';

const Auth = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true); // Toggle between login and register
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user'); // Default role as 'user'
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleAuth = async (e) => {
        e.preventDefault();
        try {
            const url = isLogin ? '/api/login' : '/api/register';
            const response = await axios.post(url, { email, password, role });

            localStorage.setItem('token', response.data.token);
            onLogin(role); // Redirect based on role
            setSuccessMessage(`Successfully ${isLogin ? 'logged in' : 'registered'}!`);
            setErrorMessage('');
        } catch (error) {
            setErrorMessage(`Failed to ${isLogin ? 'log in' : 'register'}. Please try again.`);
            setSuccessMessage('');
        }
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={6}>
                    <h2 className="text-center mb-4">{isLogin ? 'Login' : 'Register'}</h2>
                    {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                    {successMessage && <Alert variant="success">{successMessage}</Alert>}
                    <Form onSubmit={handleAuth}>
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        {!isLogin && (
                            <Form.Group className="mb-3" controlId="role">
                                <Form.Label>Select Role</Form.Label>
                                <Form.Select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <option value="user">User</option>
                                    <option value="merchant">Merchant</option>
                                </Form.Select>
                            </Form.Group>
                        )}

                        <Button variant="primary" type="submit" className="w-100">
                            {isLogin ? 'Login' : 'Register'}
                        </Button>
                    </Form>

                    <div className="text-center mt-3">
                        <Button
                            variant="link"
                            onClick={() => setIsLogin(!isLogin)}
                        >
                            {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
                        </Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Auth;
