// Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap';

const Register = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [role, setRole] = useState('user');
	const navigate = useNavigate();

	const handleRegister = async () => {
		try {
			const response = await fetch('http://localhost:4000/api/auth/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password, role })
			});
			const data = await response.json();
			if (data.token) {
				alert(data.message);
				localStorage.setItem('token', data.token);
				localStorage.setItem('user', JSON.stringify(data.account));
				navigate('/dashboard');
			} else {
				alert(data.message);
			}
		} catch (error) {
			console.error('Registration failed:', error);
		}
	};

	return (
		<Container className="mt-5">
			<h3>Register</h3>
			<Form>
				<Form.Group>
					<Form.Label>Email</Form.Label>
					<Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" />
				</Form.Group>
				<Form.Group>
					<Form.Label>Password</Form.Label>
					<Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
				</Form.Group>
				<Form.Group>
					<Form.Label>Role</Form.Label>
					<Form.Control as="select" value={role} onChange={(e) => setRole(e.target.value)}>
						<option value="user">User</option>
						<option value="merchant">Merchant</option>
					</Form.Control>
				</Form.Group>
				<Button variant="primary" onClick={handleRegister}>Register</Button>
			</Form>
			<p className="mt-3 text-center">
				Already registered? <span style={{ cursor: 'pointer', color: 'blue' }} onClick={() => navigate('/')}>Click here to login</span>
			</p>
		</Container>
	);
};

export default Register;
