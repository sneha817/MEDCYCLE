import { Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import UserLogin from './pages/user/UserLogin';
import UserRegister from './pages/user/UserRegister';
import ShopsList from './pages/user/ShopsList';
import ShopDetails from './pages/user/ShopDetails';
import UserOrderHistory from './pages/user/UserOrderHistory';
import AdminLogin from './pages/admin/AdminLogin';
import AdminRegister from './pages/admin/AdminRegister';
import Inventory from './pages/admin/Inventory';
import AddMedicine from './pages/admin/AddMedicine';
import OrderRequests from './pages/admin/OrderRequests';
import DonationHistory from './pages/admin/DonationHistory';
import Settings from './pages/admin/Settings';

function App() {
  return (
    <>
      <Header />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <main className="py-4">
        {/* Added the fade-in animation wrapper here */}
        <div className="page-fade-in">
          <Container>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<UserLogin />} />
              <Route path="/register" element={<UserRegister />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/register" element={<AdminRegister />} />

              {/* Private User Routes */}
              <Route element={<PrivateRoute role="user" />}>
                <Route path="/shops" element={<ShopsList />} />
                <Route path="/shop/:id" element={<ShopDetails />} />
                <Route path="/my-history" element={<UserOrderHistory />} />
              </Route>

              {/* Private Admin Routes */}
              <Route element={<PrivateRoute role="admin" />}>
                <Route path="/admin/inventory" element={<Inventory />} />
                <Route path="/admin/add-medicine" element={<AddMedicine />} />
                <Route path="/admin/requests" element={<OrderRequests />} />
                <Route path="/admin/history" element={<DonationHistory />} />
                <Route path="/admin/settings" element={<Settings />} />
              </Route>
            </Routes>
          </Container>
        </div>
      </main>
    </>
  );
}
export default App;
