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
    toast("Server Restarting, wait about 50 sec to wake up", {
        duration: 10000,
      });
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