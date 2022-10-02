import './App.css';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ErrPage from './pages/ErrPage';
import Header from './components/Header';
import PrivateRoutes from './utils/PrivateRoutes';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Header />
          <Routes>
            <Route element={<PrivateRoutes />}>
              <Route element={<HomePage />} path='/' exact />
              
            </Route>
            <Route element={<LoginPage />} path='/login' />
            <Route path='*' element={<ErrPage />} />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;