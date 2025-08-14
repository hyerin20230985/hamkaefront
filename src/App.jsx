import { Route, Routes } from 'react-router-dom';
import './index.css';
import "./css/style.css";
import Mappage from './pages/Mappage';
import Reportpage from './pages/Reportpage';
import Uploadpage from './pages/Uploadpage';
import Loginpage from './pages/Loginpage';
import Start from './pages/Start';
import Errpage from './pages/Errpage';
import Introduce from './pages/Introduce';
import MyPage from './pages/Mypage';
import Register from './pages/Register';

function App() {

  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Loginpage/>}/> {/*로그인 페이지*/}
        <Route path='/map' element={<Mappage/>} /> {/*맵 페이지*/}
        <Route path='/report' element={<Reportpage/>} />
        <Route path='/upload' element={<Uploadpage/>} />
        <Route path='/hamkae' element={<Start/>}/>
        <Route path='/err' element={<Errpage/>}/>
        <Route path='/Introduce' element={<Introduce/>} />
        <Route path='/MyPage' element={<MyPage/>} />
        <Route path='/Register' element={<Register/>} />
      </Routes>
    </div>
  )
}

export default App;