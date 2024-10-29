// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, Row, Col } from 'react-bootstrap';
import QRCode from 'qrcode.react';

const Dashboard = () => {
    const [wallet, setWallet] = useState({ coupons: 0, currencies: 0 });
    const [topMerchants, setTopMerchants] = useState([]);
    const [topUsers, setTopUsers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { Authorization: `Bearer ${token}` };
                const walletRes = await axios.get('/api/wallet', { headers });
                setWallet(walletRes.data);

                const merchantsRes = await axios.get('/api/top-merchants', { headers });
                setTopMerchants(merchantsRes.data);

                const usersRes = await axios.get('/api/top-users', { headers });
                setTopUsers(usersRes.data);
            } catch (error) {
                console.error('Error fetching dashboard data', error);
            }
        };
        fetchData();
    }, []);

    return (
        <Container className="mt-5">
            <h2>Dashboard</h2>
            <Row>
                <Col md={6}>
                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title>Wallet</Card.Title>
                            <p>Coupons: {wallet.coupons}</p>
                            <p>Currencies: {wallet.currencies}</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title>QR Code</Card.Title>
                            <QRCode value="Merchant QR Code here" />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col md={6}>
                    <h3>Top Merchants</h3>
                    {topMerchants.map((merchant, index) => (
                        <Card key={index} className="mb-3">
                            <Card.Body>{merchant.name} - {merchant.coupons} Coupons</Card.Body>
                        </Card>
                    ))}
                </Col>
                <Col md={6}>
                    <h3>Top Users</h3>
                    {topUsers.map((user, index) => (
                        <Card key={index} className="mb-3">
                            <Card.Body>{user.name} - {user.currencies} Currencies</Card.Body>
                        </Card>
                    ))}
                </Col>
            </Row>
        </Container>
    );
};

export default Dashboard;
