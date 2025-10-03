import React, { useEffect } from 'react';
import { Navbar, Nav, Container, NavDropdown, Badge } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import io from 'socket.io-client';
import { logout } from '../app/slices/authSlice';
import { getShopOrderRequests } from '../app/slices/orderSlice';
import { HeartPulseFill } from 'react-bootstrap-icons';

const API_URL = import.meta.env.VITE_API_URL;

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { userInfo, adminInfo } = useSelector((state) => state.auth);
  const { pendingCount } = useSelector((state) => state.orders);

  // This effect manages the real-time socket connection for admin notifications
  useEffect(() => {
    if (adminInfo) {
      const socket = io(API_URL);

      // Join a room specific to this admin
      socket.emit('joinAdminRoom', adminInfo._id);

      // Listen for new request notifications from the server
      socket.on('newRequestNotification', (data) => {
        toast.info(data.message);
        dispatch(getShopOrderRequests()); // Refresh the request list and badge
      });

      // Cleanup: Disconnect when the component unmounts or admin logs out
      return () => {
        socket.disconnect();
      };
    }
  }, [dispatch, adminInfo]);

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