import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './routes/Landing';
import Debug from './routes/Debug';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/debug" element={<Debug />} />
            </Routes>
        </Router>
    );
}

export default App;