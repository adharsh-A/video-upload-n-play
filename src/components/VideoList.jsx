import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Clock, User, ThumbsUp } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

// Mock data with additional fields

const VideoCard = ({ video }) => {

    
  return (
    <Link
      to={`/video/${video._id}`}
      className="group bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden hover:transform hover:scale-102 transition-all duration-300 border border-gray-700/50 hover:border-gray-600/50 hover:shadow-xl hover:shadow-blue-500/10"
    >
      <div className="relative">
        <img
          src={video.thumbnail.url}
          alt={video.title}
          className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-md text-xs text-white flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {video.duration}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Play className="w-12 h-12 text-white opacity-80" />
        </div>
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors duration-200">
          {video.title}
        </h2>
        <p className="text-gray-400 text-sm line-clamp-2 mb-3">
          {video.description}
        </p>
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>{video.author}</span>
          </div>
          <div className="flex items-center gap-3">
            <span>{video.views} views</span>
            <div className="flex items-center gap-1">
              <ThumbsUp className="w-4 h-4" />
              {video.likes}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const VideoList = () => {
  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls to the top-left corner of the document
  }, []); // Runs only once when the component mounts
  const [videos, setVideos] = useState([]);
useEffect(() => {
const fetchVideo = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/videos`);
    const data = response.data;
    setVideos(data);
  } catch (error) {
    console.error('Fetch video error:', error);
  }
}
fetchVideo();
}, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center space-x-4 mb-12">
          <div className="h-12 w-2 bg-blue-500 rounded-full" />
          <h1 className="text-4xl font-bold text-white">Discover Videos</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      </div>
    </div>
  );
};

const VideoPlayer = () => {
  const { id } = useParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVideo,setCurrentVideo]=useState(null);
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        toast.loading("Fetching video...");
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/videos/${id}`);
        const data = response.data;
        setCurrentVideo(data);
        console.log(currentVideo);
      } catch (error) {
        console.error('Fetch video error:', error);
      }finally{
        toast.dismiss();
      }
    }
    fetchVideo();
  }, [id])

  if (!currentVideo) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Video not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="relative rounded-xl overflow-hidden shadow-2xl shadow-blue-500/10">
          <video
            className="w-full aspect-video object-cover"
            controls
            autoPlay
            muted
            src={currentVideo.videoUrl.url}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        </div>
        
        <div className="mt-8 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <h1 className="text-3xl font-bold text-white mb-4">{currentVideo.title}</h1>
          <div className="flex items-center justify-between mb-6 text-gray-400">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span>{currentVideo.author}</span>
              </div>
              <span>•</span>
              <span>{currentVideo.views} views</span>
            </div>
            <div className="flex items-center gap-2">
              <ThumbsUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-gray-300 leading-relaxed">{currentVideo.description}</p>
        </div>
      </div>
    </div>
  );
};

export { VideoList, VideoPlayer };