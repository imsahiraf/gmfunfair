// src/components/Transactions.js
import React, { useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Alert, Row, Col, Card } from 'react-bootstrap';
import QrReader from 'react-qr-reader';

const Transactions = () => {
    const [receiverId, setReceiverId] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('coupon');
    const [successMessage, setSuccessMessage] = useState('');
    const [scanResult, setScanResult] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const handleTransaction = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                '/api/transaction',
                { receiverId, amount, type },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSuccessMessage('Transaction successful!');
            setErrorMessage('');
            setReceiverId('');
            setAmount('');
        } catch (error) {
            setErrorMessage('Transaction failed. Please try again.');
            setSuccessMessage('');
        }
    };

    const handleScan = (data) => {
        if (data) {
            setScanResult(data);
            setReceiverId(data); // QR code contains receiverId
        }
    };

    return (
        <Container className="mt-5">
            <h2 className="text-center mb-4">Make a Transaction</h2>
            <Row className="justify-content-center">
                <Col md={6}>
                    {successMessage && <Alert variant="success" className="text-center">{successMessage}</Alert>}
                    {errorMessage && <Alert variant="danger" className="text-center">{errorMessage}</Alert>}
                </Col>
            </Row>
            <Row>
                <Col md={6} className="text-center mb-4">
                    <Card>
                        <Card.Header as="h5">Scan QR Code</Card.Header>
                        <Card.Body>
                            <QrReader
                                onScan={handleScan}
                                onError={(err) => console.error(err)}
                                style={{ width: '100%' }}
                            />
                            <p className="mt-3">Scan to get the receiver's ID</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card>
                        <Card.Header as="h5">Transaction Details</Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleTransaction}>
                                <Form.Group controlId="receiverId" className="mb-3">
                                    <Form.Label>Receiver ID</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Scanned or enter receiver ID"
                                        value={receiverId}
                                        onChange={(e) => setReceiverId(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="amount" className="mb-3">
                                    <Form.Label>Amount</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Enter amount"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="type" className="mb-4">
                                    <Form.Label>Transaction Type</Form.Label>
                                    <Form.Select
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                        required
                                    >
                                        <option value="coupon">Coupon</option>
                                        <option value="currency">Currency</option>
                                    </Form.Select>
                                </Form.Group>
                                <Button variant="primary" type="submit" className="w-100">
                                    Send {type === 'coupon' ? 'Coupon' : 'Currency'}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Transactions;
