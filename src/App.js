import logo from './logo.svg';
import './App.css';

import { Routes, Route } from 'react-router-dom';
import Homepage from './pages/homepage';
import Register from './pages/register';
import Login from './pages/login';
import NavBar from './components/navbar';
import User from './pages/user';
import Product from './pages/product';
import TypeProduct from './pages/product_type';
import PointSale from './pages/point_sale';
import Diary from './pages/diary';
import Report from './pages/report';
function App() {
  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path='/product' element={<Product />} />
        <Route path='/typeproduct' element={<TypeProduct />} />
        <Route path='/pointsale' element={<PointSale />} />
        <Route path='/user' element={<User />} />
        <Route path='/diary' element={<Diary/>} />
        <Route path='/report' element={<Report />} />
      </Routes>
    </div>
  );
}

export default App;
