import { Route, Routes } from 'react-router-dom';
import './index.css';
import "./css/style.css";
import Mappage from './pages/Mappage';
import Reportpage from './pages/Reportpage';
import Uploadpage from './pages/Uploadpage';
import Loginpage from './pages/Loginpage';
import Errpage from './pages/Errpage';
import Introduce from './pages/Introduce';
import MyPage from './pages/Mypage';
import Register from './pages/Register';
import Mainpage from './pages/Mainpage';
import Navbar from './components/Navbar';

function App() {

  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Loginpage/>}/> {/*로그인 페이지*/}
        <Route path='/map' element={<Mappage/>} /> {/*맵 페이지*/}
        <Route path='/report' element={<Reportpage/>} />
        <Route path='/upload/:markerId' element={<Uploadpage/>} />
        <Route path='/err' element={<Errpage/>}/>
        <Route path='/Introduce' element={<Introduce/>} />
        <Route path='/MyPage' element={<MyPage/>} />
        <Route path='/Register' element={<Register/>} />
        <Route path='/home' element={<Mainpage/>}/> 
      </Routes>
      <Navbar/>
    </div>
  )
}

export default App;