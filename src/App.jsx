import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Navbar from './components/ui/NavBar';

// Lazy load components
const UploadForm = lazy(() => import('./components/UploadForm'));
const VideoList = lazy(() => import('./components/VideoList').then(module => ({ default: module.VideoList })));
const VideoPlayer = lazy(() => import('./components/VideoList').then(module => ({ default: module.VideoPlayer })));
import Loader from './components/ui/Loader';
import { Toaster, toast } from 'sonner'
import { useEffect } from 'react';


// App Component
const App = () => {
  useEffect(() => {
    const hasToastBeenShown = localStorage.getItem('serverRestartToastShown');
  
    if (!hasToastBeenShown) {
      fetch("https://video-upload-n-play-backend.onrender.com/api/users")
        .then(response => {
          if (!response.ok) {
            throw new Error('Server not responding');
          }
        })
        .catch(error => {
          console.error('Failed to wake up server:', error);
        });
  
      toast("Server Restarting, wait about 50 sec to wake up");
  
      // Mark that toast has been shown
      localStorage.setItem('serverRestartToastShown', 'true');
  
      // Set timeout to remove the toast and reset the flag after 2 minutes
      setTimeout(() => {
        localStorage.removeItem('serverRestartToastShown');
        // Dismiss toast (if using a library like Toastify)
        toast.dismiss();
      }, 120000); // 2 minutes = 120,000 milliseconds
    }
  }, []);
  
  return (
    <Router>
      <Navbar />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<UploadForm />} />
          <Route path="/videos" element={<VideoList />} />
          <Route path="/video/:id" element={<VideoPlayer />} />
        </Routes>
      </Suspense>
      <Toaster richColors position="top-center"/>
    </Router>
  );
};

export default App;  