import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Home.css';
import { Search, BoxArrowInRight, HandThumbsUp } from 'react-bootstrap-icons';

const Home = () => {
    return (
        <>
            {/* Hero Section */}
            <header className="hero-section">
                <div className="hero-content">
                    <h1>Don't Let Good Medicine Go To Waste</h1>
                    <p>
                        Connect with local pharmacies to receive essential medicines nearing expiry, free of cost.
                    </p>
                    <div className="hero-buttons">
                        <Link to="/shops">
                            <Button variant="primary" size="lg">Request Medicine</Button>
                        </Link>
                        <Link to="/admin/login">
                            <Button variant="outline-light" size="lg">Admin Portal</Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* How It Works Section */}
            <Container>
                <section className="how-it-works">
                    <h2 className="section-title">A Simple Process</h2>
                    <p className="section-subtitle">Get the help you need in three easy steps.</p>
                    <Row>
                        <Col md={4} className="mb-4">
                            <Card className="step-card h-100">
                                <Card.Body>
                                    <div className="step-icon"><Search /></div>
                                    <h3>1. Find a Shop</h3>
                                    <p>Search for participating medical shops and pharmacies in your area.</p>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4} className="mb-4">
                            <Card className="step-card h-100">
                                <Card.Body>
                                    <div className="step-icon"><BoxArrowInRight /></div>
                                    <h3>2. Request Medicine</h3>
                                    <p>View available medicines and submit a request for what you need.</p>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4} className="mb-4">
                            <Card className="step-card h-100">
                                <Card.Body>
                                    <div className="step-icon"><HandThumbsUp /></div>
                                    <h3>3. Get Approved</h3>
                                    <p>The shop owner will approve your request and you'll be notified.</p>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </section>
            </Container>
            
            {/* For Shop Owners Section */}
            <section className="for-shop-owners">
                <Container>
                    <Row className="align-items-center">
                        <Col md={7} className="shop-owner-content p-5">
                            <h2>Join Our Network of Donors</h2>
                            <p className="my-4">
                                Are you a pharmacy or medical shop owner? Join our platform to easily manage expiring inventory, reduce waste, and make a tangible impact in your community.
                            </p>
                            <Link to="/admin/register">
                                <Button variant="success" size="lg">Register Your Shop</Button>
                            </Link>
                        </Col>
                        <Col md={5} className="text-center d-none d-md-block">
                           
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Call to Action Section */}
            <Container fluid className="cta-section py-5 text-center text-white mt-5 home__bg">
                <h2 className="display-5 fw-bold mb-4">Ready to Make a Difference?</h2>
                <p className="lead mb-4">
                    Whether you need medicine or want to donate, join our community today.
                </p>
                <Link to="/register">
                    <Button variant="light" size="lg">Join Now</Button>
                </Link>
            </Container>
        </>
    );
};

export default Home;