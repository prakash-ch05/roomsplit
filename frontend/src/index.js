import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<App />)

// Register Service Worker for PWA
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/sw.js')
//       .then(() => console.log('RoomSplit SW registered'))
//       .catch(err => console.log('SW error:', err))
//   })
// }