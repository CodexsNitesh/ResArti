import { useEffect, useState } from "react";
import { Download, Share2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AnalysisCard from "../components/AnalysisCard";

const Dashboard = () => {
  const [analysis, setAnalysis] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedData = localStorage.getItem("analysis");

    if (storedData) {
      setAnalysis(JSON.parse(storedData));
    }
  }, []);

  if (!analysis) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 md:mb-4">No Analysis Data Found</h2>
          <p className="text-gray-600 mb-6 md:mb-8 text-sm md:text-base">Please upload a resume to see your analysis</p>
          <button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold py-2 md:py-3 px-6 md:px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 mx-auto text-sm md:text-base"
          >
            <ArrowLeft size={18} /> Back to Upload
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-primary-50 to-accent-50 py-12 px-4 md:px-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 md:mb-12">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold mb-4 md:mb-6 transition-colors text-sm md:text-base"
        >
          <ArrowLeft size={18} /> Upload New Resume
        </button>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6 mb-8 md:mb-12">
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 md:mb-3 bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent leading-tight">
              Resume Analysis Results
            </h1>
            <p className="text-gray-600 text-sm md:text-lg">Your comprehensive AI-powered resume evaluation</p>
          </div>
          
          <div className="flex flex-wrap gap-2 md:gap-4 w-full md:w-auto">
            <button className="flex items-center gap-2 bg-white border-2 border-primary-300 text-primary-600 hover:bg-primary-50 font-semibold py-2 px-4 md:px-6 rounded-lg transition-all duration-200 shadow-md text-sm md:text-base">
              <Download size={18} /> Export
            </button>
            <button className="flex items-center gap-2 bg-white border-2 border-accent-300 text-accent-600 hover:bg-accent-50 font-semibold py-2 px-4 md:px-6 rounded-lg transition-all duration-200 shadow-md text-sm md:text-base">
              <Share2 size={18} /> Share
            </button>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          <AnalysisCard
            title="ATS Score"
            content={analysis?.atsScore || "N/A"}
          />

          <AnalysisCard
            title="Strengths"
            content={analysis?.strengths || "No data"}
          />

          <AnalysisCard
            title="Weaknesses"
            content={analysis?.weaknesses || "No data"}
          />

          <AnalysisCard
            title="Missing Skills"
            content={analysis?.missingSkills || "No data"}
          />

          <AnalysisCard
            title="Interview Questions"
            content={analysis?.interviewQuestions || "No data"}
          />

          <AnalysisCard
            title="Career Suggestions"
            content={analysis?.careerSuggestions || "No data"}
          />
        </div>
      </div>

      {/* Footer CTA */}
      <div className="max-w-7xl mx-auto mt-12 md:mt-16 text-center">
        <div className="bg-white border-2 border-primary-100 rounded-xl md:rounded-2xl p-6 md:p-8 shadow-lg">
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-4">Ready to Improve Your Resume?</h3>
          <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">Make the recommended changes and upload again for a fresh analysis</p>
          <button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold py-2 md:py-3 px-6 md:px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 text-sm md:text-base"
          >
            Upload Updated Resume
          </button>
        </div>
      </div>
    </div>
  );
};


export default Dashboard;