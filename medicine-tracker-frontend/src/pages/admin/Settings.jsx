import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { updateAdminProfile } from '../../app/slices/authSlice';

const Settings = () => {
    const dispatch = useDispatch();
    const { adminInfo, loading, error } = useSelector((state) => state.auth);
    
    const [shopName, setShopName] = useState(adminInfo?.shopName || '');
    const [address, setAddress] = useState(adminInfo?.address || '');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (adminInfo) {
            setShopName(adminInfo.shopName);
            setAddress(adminInfo.address);
        }
    }, [adminInfo]);
    
    const submitHandler = (e) => {
        e.preventDefault();
        setMessage('');
        dispatch(updateAdminProfile({ shopName, address })).then((result) => {
            if (result.meta.requestStatus === 'fulfilled') {
                setMessage('Profile Updated Successfully!');
            }
        });
    };

    return (
        <Row className="justify-content-md-center mt-5">
            <Col xs={12} md={6} lg={5}>
                <Card className="p-4">
                    <Card.Body>
                        <h1 className="text-center mb-4">Shop Settings</h1>
                        {message && <Message variant='success'>{message}</Message>}
                        {error && <Message variant='danger'>{error}</Message>}
                        {loading && <Loader />}
                        <Form onSubmit={submitHandler}>
                            <Form.Group className="my-3" controlId="shopName">
                                <Form.Label>Shop Name</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    value={shopName} 
                                    onChange={(e) => setShopName(e.target.value)} 
                                    required 
                                />
                            </Form.Group>
                            <Form.Group className="my-3" controlId="address">
                                <Form.Label>Address</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    value={address} 
                                    onChange={(e) => setAddress(e.target.value)} 
                                    required 
                                />
                            </Form.Group>
                            <div className="d-grid">
                                <Button type="submit" variant="primary" className="mt-3">
                                    Update Profile
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default Settings;