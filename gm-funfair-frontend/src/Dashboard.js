import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Table, Card } from 'react-bootstrap';
import { QRCodeCanvas } from 'qrcode.react';
import { QrReader } from 'react-qr-reader';

const Dashboard = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [transactions, setTransactions] = useState([]);
    const [topUsers, setTopUsers] = useState([]);
    const [topMerchants, setTopMerchants] = useState([]);
    const [balance, setBalance] = useState({ coupons: 0, currencies: 0 });
    const [scanResult, setScanResult] = useState(null);
    const [amount, setAmount] = useState('');
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [isQRCodeVisible, setIsQRCodeVisible] = useState(false); // State for QR Code visibility

    const fetchTransactions = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:4000/api/transaction/fetch-transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ userId: user.role === 'user' ? user.id : null, merchantId: user.role === 'merchant' ? user.id : null })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            const data = await response.json();
            setTransactions(data.transactions);
            setBalance({
				coupons: user.role === 'user' ? data?.userData?.coupons : data?.userData?.total_coupons_received,
				currencies: user.role === 'user' ? data?.userData?.total_currency_received : data?.userData?.currencies
			});
            setTopUsers(data.topUsers || []);
            setTopMerchants(data.topMerchants || []);
        } catch (error) {
            console.error('Fetch Transactions Error:', error.message);
            alert('Failed to fetch transactions: ' + error.message);
        }
    };

    useEffect(() => {
        fetchTransactions();
        const interval = setInterval(fetchTransactions, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleTransaction = async () => {
        const token = localStorage.getItem('token');
        const type = user.role === 'user' ? 'coupon' : 'currency';

        try {
            const response = await fetch('http://localhost:4000/api/transaction/transaction', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ userId: user.role === 'user' ? user.id : scanResult.id, merchantId: user.role === 'merchant' ? user.id : scanResult.id, amount, type })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            const data = await response.json();
            if (data.message === "Transaction successful") {
                fetchTransactions();
                alert("Transaction successful!");
                // Resetting states after a successful transaction
                setAmount('');
                setScanResult(null);
				window.location.reload()
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Transaction Error:', error.message);
			setScanResult(null);
            alert('Transaction failed: ' + error.message);
        }
    };

    const handleScan = (data) => {
        if (data && !scanResult) {
            const [scannedRole, scannedId] = data?.text.split(':');
            if (scannedRole === user.role) {
                alert("Can't transact with the same role!");
            } else if (data?.text) {
                setScanResult({ id: scannedId, role: scannedRole });
            }
			setIsScannerOpen(false)
        }
    };

    const handleError = (error) => {
        console.error('QR Scan Error:', error);
    };

    return (
        <Container className="mt-5">
			<Row className="d-flex justify-content-between align-items-center">
                <Col xs="auto">
                    <img src={'logo192.png'} alt="Logo" style={{ width: '50px', height: '50px' }} />
                </Col>
                <Col xs="auto">
                    <Button variant="danger" onClick={() => { localStorage.clear(); window.location.reload(); }}>
                        Logout
                    </Button>
                </Col>
            </Row>
			<br/>
            <Row>
                <Col md={8}>
                    <h3>Wallet Balance</h3>
                    <Card>
                        <Card.Body>
                            <p>Coupons: {balance.coupons}</p>
                            <p>Currencies: {balance.currencies}</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="mt-3" style={{ textAlign: 'center' }}>
                <Col md={6}>
                    {!isQRCodeVisible && !isScannerOpen && (
                        <Button variant="primary" onClick={() => setIsQRCodeVisible(true)}>
                            My QR Code
                        </Button>
                    )}
                    {isQRCodeVisible && (
                        <>
                            <QRCodeCanvas value={`${user.role}:${user.id}`} /><br/>
                            <Button variant="secondary" onClick={() => setIsQRCodeVisible(false)}>
                                Back
                            </Button>
                        </>
                    )}
                </Col>
                <Col md={6}>
                    {!isQRCodeVisible && !isScannerOpen && (
                        <Button variant="primary" onClick={() => setIsScannerOpen(true)}>
                            Scan QR Code
                        </Button>
                    )}
                    {isScannerOpen && (
                        <>
                            <QrReader
                                onError={handleError}
                                onResult={handleScan}
                                style={{ width: '100%', marginTop: '10px' }}
                            />
                            <Button variant="secondary" onClick={() => window.location.reload()}>
                                Back
                            </Button>
                        </>
                    )}
                </Col>
            </Row>
            {scanResult && (
                <Row className="mt-3">
                    <Col md={12}>
                        <h4>Enter Amount</h4>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Amount"
                        />
                        <Button variant="success" onClick={handleTransaction}>
                            Submit
                        </Button>
                        <Button variant="secondary" onClick={() => {
                            setScanResult(null);
                            setAmount('');
							window.location.reload();
                        }}>
                            Back
                        </Button>
                    </Col>
                </Row>
            )}
			<br/>
            <Row className="mt-3">
                <Col md={6}>
                    <h4>Top 3 Merchants</h4>
                    <ul>
                        {topMerchants.map((merchant, i) => (
                            <li key={i}>{merchant.email} - Coupons Received: {merchant.total_coupons_received}</li>
                        ))}
                    </ul>
                </Col>
                <Col md={6}>
                    <h4>Top 3 Users</h4>
                    <ul>
                        {topUsers.map((user, i) => (
                            <li key={i}>{user.email} - Currencies Received: {user.total_currency_received}</li>
                        ))}
                    </ul>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col md={12}>
                    <h4>Transaction History</h4>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
								<th>Paid By</th>
								<th>Paid Received</th>
                                <th>Type</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((tx, i) => (
                                <tr key={i}>
                                    <td>{tx.paid_by}</td>
                                    <td>{tx.paid_to}</td>
                                    <td>{tx.type}</td>
                                    <td>{tx.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    );
};

export default Dashboard;
