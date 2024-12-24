import axios from "axios";
import { Upload, FileVideo } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const UploadForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnail: null,
    video: null,
  });
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [dragActive, setDragActive] = useState({
    thumbnail: false,
    video: false,
  });
  const [fileStatus, setFileStatus] = useState({
    thumbnail: "",
    video: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.loading("Uploading...");

    const form = new FormData();
    form.append("title", formData.title);
    form.append("description", formData.description);
    form.append("thumbnail", formData.thumbnail);
    form.append("video", formData.video);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/upload`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        const result = response.data;
        console.log("Upload successful:", result);
        toast.success("Video uploaded successfully");
        navigate("/videos");
      } else {
        console.error("Upload failed:", response);
        toast.error("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      if (error.response) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert("An error occurred. Please try again.");
      }
    } finally {
      toast.dismiss();
    }
  };

  const handleFileChange = (type, file) => {
    if (file) {
      if (type === "thumbnail") {

        const reader = new FileReader();
        reader.onloadend = () => {
          setThumbnailPreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
      setFormData({ ...formData, [type]: file });
    }
  };
  useEffect(() => {
    if (formData.thumbnail) {
      setFileStatus((prev) => ({ ...prev, thumbnail: "Thumbnail updated" }));
      toast.success("Thumbnail updated");
    }
  }, [formData.thumbnail]);

  useEffect(() => {
    if (formData.video) {
      setFileStatus((prev) => ({ ...prev, video: "Video updated" }));
      toast.success("Video updated");
    }
  }, [formData.video]);

  const FileInput = ({ type, accept, onChange }) => (
    <div
      className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 
        ${
          dragActive[type]
            ? "border-blue-500 bg-blue-500/10"
            : "border-gray-600 hover:border-gray-500"
        }`}
      onDragEnter={() => setDragActive((prev) => ({ ...prev, [type]: true }))}
      onDragLeave={() => setDragActive((prev) => ({ ...prev, [type]: false }))}
      onDrop={() => setDragActive((prev) => ({ ...prev, [type]: false }))}
    >
      <input
        type="file"
        accept={accept}
        onChange={(e) => {
          onChange(e);
          handleFileChange(type, e.target.files[0]);
        }}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      <div className="flex flex-col items-center space-y-4">
        {type === "thumbnail" && thumbnailPreview ? (
          <img
            src={thumbnailPreview}
            alt="Thumbnail preview"
            className="w-32 h-32 object-cover rounded"
          />
        ) : type === "thumbnail" ? (
          <Upload className="w-8 h-8 text-gray-400" />
        ) : (
          <FileVideo className="w-8 h-8 text-gray-400" />
        )}
        <div className="text-gray-300">
          <span className="font-medium text-blue-500">Click to upload</span> or
          drag and drop
          <p className="text-sm text-gray-400 mt-2">
            {type === "thumbnail" ? "JPG or PNG" : "MPG, AVI, or MP4"}
          </p>
          {fileStatus[type] && (
            <p className="text-sm text-green-500 mt-2">{fileStatus[type]}</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-gray-900 p-8 flex items-center justify-center">
      <div className="w-[700px] bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-700">
        <div className="flex items-center space-x-4 mb-8">
          <div className="h-12 w-2 bg-blue-500 rounded-full" />
          <h1 className="text-3xl font-bold text-white">Upload Video</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title
              </label>
              <input
                type="text"
                maxLength="50"
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-gray-200/80 focus:border-transparent transition-all duration-200"
                placeholder="Enter a descriptive title"
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
              <p className="mt-2 text-xs text-gray-400">
                Maximum 50 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                maxLength="200"
                rows="4"
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-gray-200/80 focus:border-transparent transition-all duration-200 resize-none"
                placeholder="Describe your video"
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
              <p className="mt-2 text-xs text-gray-400">
                Maximum 200 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Thumbnail
              </label>
              <FileInput
                type="thumbnail"
                accept=".jpg,.jpeg,.png"
                onChange={(e) =>
                  setFormData({ ...formData, thumbnail: e.target.files[0] })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Video
              </label>
              <FileInput
                type="video"
                accept=".mpg,.avi,.mp4"
                onChange={(e) =>
                  setFormData({ ...formData, video: e.target.files[0] })
                }
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-blue-500/25"
          >
            <Upload className="w-5 h-5" />
            <span>Upload Video</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadForm;
