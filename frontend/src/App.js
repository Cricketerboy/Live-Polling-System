import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Teacher from './pages/Teacher';
import Student from './pages/Student';
import RoleSelection from "./pages/RoleSelection";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RoleSelection />} />
        <Route path="/student" element={<Student />} />
        <Route path="/teacher" element={<Teacher />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
