import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AuthGuard } from './components/AuthGuard';
import { Login } from './pages/auth/Login';
import { SignUp } from './pages/auth/SignUp';
import { CompleteProfile } from './pages/auth/CompleteProfile';
import { ScriptAnalyzer } from './pages/ScriptAnalyzer';
import { VideoAnalyzer } from './pages/VideoAnalyzer';
import { CoCreate } from './pages/CoCreate';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth">
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="complete-profile" element={<CompleteProfile />} />
        </Route>
        
        <Route
          path="/"
          element={
            <AuthGuard>
              <Layout />
            </AuthGuard>
          }
        >
          <Route index element={<Navigate to="/script" replace />} />
          <Route path="script" element={<ScriptAnalyzer />} />
          <Route path="video" element={<VideoAnalyzer />} />
          <Route path="co-create" element={<CoCreate />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;