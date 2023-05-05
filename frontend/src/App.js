
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Admin from './Pages/Admin';
import BuyNow from './Pages/BuyNow';
import Home from './Pages/Home';
import Login from './Pages/Login';
import OrderPanel from './Pages/OrderPanel';
import ShowCart from './Pages/ShowCart';
import ShowOrders from './Pages/ShowOrders';
import Signup from './Pages/Signup';
<style>
  @import url('https://fonts.googleapis.com/css2?family=IM+Fell+Double+Pica&display=swap');
</style>
function App() {
  return (
    <BrowserRouter>
    
    <div className="App">
      <Routes>
          <Route path='/' element={<Login/>}/>
          <Route path='/home' element={<Home/>}/>
          <Route path='/admin' element={<Admin/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/buynow/:id' element={<BuyNow/>}/>
          <Route path='/showorders' element={<ShowOrders/>}/>
          <Route path='/orderpanel' element={<OrderPanel/>}/>
          <Route path='/showcart' element={<ShowCart/>}/>
      </Routes>

    </div>
    
    </BrowserRouter>
  );
}

export default App;
