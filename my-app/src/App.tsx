import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GroupPage from './pages/GroupPage';
import EditorPage from './pages/EditorPage';

const App: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/editor" element={<EditorPage />} />
            <Route path="/groups" element={<GroupPage />} />
        </Routes>
    );
}

export default App;
