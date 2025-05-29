import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Teacher from './pages/Teacher';
import Student from './pages/Student';
import RoleSelection from "./pages/RoleSelection";
import PollHistory from "./pages/PollHistory";

import { ChatProvider } from './contexts/ChatContext'; 

function App() {
  return (
    <ChatProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RoleSelection />} />
          <Route path="/student" element={<Student />} />
          <Route path="/teacher" element={<Teacher />} />
          <Route path="/poll-history" element={<PollHistory />} />
        </Routes>
      </BrowserRouter>
    </ChatProvider>
  );
}

export default App;
