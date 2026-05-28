import { useState } from "react";
import API from "../services/api";
import {
  UploadCloud,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const UploadBox = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a PDF resume");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLoading(true);

      const response = await API.post(
        "/resume/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Resume analyzed successfully");

      localStorage.setItem(
        "analysis",
        JSON.stringify(response.data)
      );

      navigate("/dashboard");

    } catch (error) {
      console.log(error);
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);

      toast.success(
        `File selected: ${selectedFile.name}`
      );
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      
      {/* Main Card */}
      <div className="bg-white rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.08)] overflow-hidden border border-orange-100">

        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-100 via-orange-100 to-amber-100 px-6 sm:px-10 py-10 text-center relative">

          <div className="absolute top-4 right-4 opacity-20">
            <Sparkles
              size={80}
              className="text-orange-500"
            />
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-3">
            AI Resume Analyzer
          </h1>

          <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Upload your resume and get ATS score,
            missing skills, interview questions,
            and AI-powered career suggestions instantly.
          </p>
        </div>

        {/* Upload Area */}
        <div className="p-5 sm:p-10">

          <div
            className={`
              relative
              border-2
              border-dashed
              rounded-3xl
              transition-all
              duration-300
              p-8
              sm:p-12
              text-center

              ${
                file
                  ? "border-green-400 bg-green-50"
                  : "border-orange-300 bg-orange-50 hover:border-orange-500 hover:bg-orange-100"
              }
            `}
          >

            {/* Icon */}
            <div className="mb-6 flex justify-center">

              {file ? (
                <div className="bg-green-100 p-5 rounded-full">
                  <CheckCircle2
                    size={60}
                    className="text-green-600"
                  />
                </div>
              ) : (
                <div className="bg-orange-100 p-5 rounded-full animate-pulse">
                  <UploadCloud
                    size={60}
                    className="text-orange-500"
                  />
                </div>
              )}

            </div>

            {/* Upload Input */}
            <label className="cursor-pointer block">

              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="space-y-2">

                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  {file
                    ? "Resume Ready!"
                    : "Upload Your Resume"}
                </h2>

                <p className="text-gray-600 text-sm sm:text-base">
                  Drag & drop or click to upload PDF
                </p>

              </div>

            </label>

            {/* File Info */}
            {file && (
              <div className="mt-8 bg-white border border-green-200 rounded-2xl p-4 sm:p-5 shadow-sm">

                <p className="text-green-700 font-semibold break-all">
                  {file.name}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  {(file.size / 1024).toFixed(2)} KB
                </p>

              </div>
            )}

            {/* Button */}
            <button
              onClick={handleUpload}
              disabled={loading || !file}
              className={`
                mt-8
                w-full
                sm:w-auto
                px-10
                py-4
                rounded-2xl
                font-bold
                text-lg
                transition-all
                duration-300

                ${
                  loading || !file
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : `
                      bg-gradient-to-r
                      from-orange-500
                      via-amber-500
                      to-yellow-500
                      hover:scale-105
                      hover:shadow-2xl
                      text-white
                    `
                }
              `}
            >

              {loading ? (
                <span className="flex items-center justify-center gap-3">

                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>

                  Analyzing Resume...

                </span>
              ) : (
                "Upload & Analyze"
              )}

            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default UploadBox;