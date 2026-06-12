import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Welcome from './pages/welcome'
import CreateRoom from './pages/CreateRoom'
import JoinRoom from './pages/JoinRoom'
import Home from './pages/Home'
import Split from './pages/Split'
import Members from './pages/Members'
import Invite from './pages/Invite'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/create" element={<CreateRoom />} />
        <Route path="/join" element={<JoinRoom />} />
        <Route path="/home" element={<Home />} />
        <Route path="/split" element={<Split />} />
        <Route path="/members" element={<Members />} />
        <Route path="/invite" element={<Invite />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App