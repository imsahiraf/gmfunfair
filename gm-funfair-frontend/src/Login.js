// Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [role, setRole] = useState('user'); // Default role is 'user'
	const navigate = useNavigate();

	const handleLogin = async () => {
		try {
			const response = await fetch('http://localhost:4000/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password, role })
			});
			const data = await response.json();
			if (data.token) {
				localStorage.setItem('token', data.token);
				localStorage.setItem('user', JSON.stringify(data.account));
				window.location.href = '/dashboard';
			} else {
				alert(data.message);
			}
		} catch (error) {
			console.error('Login failed:', error);
		}
	};

	return (
		<Container className="mt-5">
			<Row className="justify-content-md-center">
				<Col md={6}>
					<h3 className="text-center">Login</h3>
					<Form>
						<Form.Group controlId="formEmail" className="mb-3">
							<Form.Label>Email address</Form.Label>
							<Form.Control
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="Enter email"
							/>
						</Form.Group>

						<Form.Group controlId="formPassword" className="mb-3">
							<Form.Label>Password</Form.Label>
							<Form.Control
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Password"
							/>
						</Form.Group>

						<Form.Group controlId="formRole" className="mb-3">
							<Form.Label>Role</Form.Label>
							<Form.Control as="select" value={role} onChange={(e) => setRole(e.target.value)}>
								<option value="user">User</option>
								<option value="merchant">Merchant</option>
							</Form.Control>
						</Form.Group>

						<Button variant="primary" onClick={handleLogin} className="w-100">
							Login
						</Button>
					</Form>
					<p className="mt-3 text-center">
						Not registered? <span style={{ cursor: 'pointer', color: 'blue' }} onClick={() => navigate('/register')}>Click here to register</span>
					</p>
				</Col>
			</Row>
		</Container>
	);
};

export default Login;
