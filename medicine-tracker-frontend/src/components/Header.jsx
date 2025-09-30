import React, { useEffect, useRef } from 'react';
import { Navbar, Nav, Container, NavDropdown, Badge } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { logout } from '../app/slices/authSlice';
import { getShopOrderRequests } from '../app/slices/orderSlice';
import { HeartPulseFill } from 'react-bootstrap-icons';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { userInfo, adminInfo } = useSelector((state) => state.auth);
  const { pendingCount } = useSelector((state) => state.orders);

  const prevPendingCountRef = useRef(pendingCount);

  // This effect starts polling for requests when an admin logs in
  useEffect(() => {
    if (adminInfo) {
      dispatch(getShopOrderRequests()); // Initial fetch
      const interval = setInterval(() => {
        dispatch(getShopOrderRequests());
      }, 10000); // Poll every 10 seconds

      return () => clearInterval(interval); // Cleanup when component unmounts or admin logs out
    }
  }, [dispatch, adminInfo]);

  // This effect triggers the toast when the pending request count increases
  useEffect(() => {
    if (pendingCount > prevPendingCountRef.current) {
      toast.info('You have a new medicine request!');
    }
    prevPendingCountRef.current = pendingCount;
  }, [pendingCount]);

  const logoutHandler = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <Navbar className="navbar-custom-grey" variant="dark" expand="lg" collapseOnSelect>
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>
            <HeartPulseFill className="me-2" /> 
            Medicine Donation
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {userInfo && (<LinkContainer to="/shops"><Nav.Link>Shops</Nav.Link></LinkContainer>)}
            {userInfo ? (
              <NavDropdown title={userInfo.email} id="user-menu">
                <LinkContainer to="/my-history"><NavDropdown.Item>My History</NavDropdown.Item></LinkContainer>
                <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
              </NavDropdown>
            ) : adminInfo ? (
              <NavDropdown title={`ADMIN: ${adminInfo.shopName}`} id="admin-menu">
                <LinkContainer to="/admin/inventory"><NavDropdown.Item>Inventory</NavDropdown.Item></LinkContainer>
                <LinkContainer to="/admin/add-medicine"><NavDropdown.Item>Add Medicine</NavDropdown.Item></LinkContainer>
                <LinkContainer to="/admin/requests">
                  <NavDropdown.Item>
                    Requests {pendingCount > 0 && <Badge pill bg="danger">{pendingCount}</Badge>}
                  </NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/admin/history"><NavDropdown.Item>History</NavDropdown.Item></LinkContainer>
                <LinkContainer to="/admin/settings"><NavDropdown.Item>Settings</NavDropdown.Item></LinkContainer>
                <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <LinkContainer to="/login"><Nav.Link>Sign In</Nav.Link></LinkContainer>
            )}
            {!userInfo && !adminInfo && (<LinkContainer to="/admin/login"><Nav.Link>Admin Portal</Nav.Link></LinkContainer>)}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;