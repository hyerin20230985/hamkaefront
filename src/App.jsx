// import './fonts.css'
import { Route, Routes } from 'react-router-dom'
import './index.css'
import "./css/style.css";
import Maps from './pages/Maps';
import Introduce from './pages/Introduce';
import MyPage from './pages/Mypage';
import Register from './pages/Register';

function App() {

  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Maps/>} />
        <Route path='/Introduce' element={<Introduce/>} />
        <Route path='/MyPage' element={<MyPage/>} />
        <Route path='/Register' element={<Register/>} />
      </Routes>
    </div>
  )
}

export default App;