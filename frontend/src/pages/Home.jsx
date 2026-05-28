import UploadBox from "../components/UploadBox";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 md:py-20">
      <div className="text-center mb-8 md:mb-12 max-w-4xl">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-primary-600 via-accent-500 to-primary-700 bg-clip-text text-transparent leading-tight">
          Analyze Your Resume with AI
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-gray-700 text-center max-w-3xl leading-relaxed mx-auto">
          Upload your resume and get AI-powered insights including ATS score,
          <span className="block text-primary-600 font-semibold mt-2">missing skills, interview questions, and improvement suggestions.</span>
        </p>
      </div>

      <div className="mb-8 md:mb-12 w-full">
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-8 md:mb-12">
          <div className="text-center flex-1 min-w-[120px] sm:min-w-[150px]">
            <div className="bg-gradient-to-br from-accent-400 to-accent-500 rounded-full p-3 md:p-4 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center mx-auto mb-2 md:mb-3 shadow-lg">
              <span className="text-xl md:text-2xl font-bold text-gray-800">📊</span>
            </div>
            <p className="text-gray-700 font-semibold text-sm md:text-base">ATS Score</p>
          </div>
          <div className="text-center flex-1 min-w-[120px] sm:min-w-[150px]">
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-full p-3 md:p-4 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center mx-auto mb-2 md:mb-3 shadow-lg">
              <span className="text-xl md:text-2xl font-bold text-white">💡</span>
            </div>
            <p className="text-gray-700 font-semibold text-sm md:text-base">Smart Insights</p>
          </div>
          <div className="text-center flex-1 min-w-[120px] sm:min-w-[150px]">
            <div className="bg-gradient-to-br from-accent-400 to-accent-500 rounded-full p-3 md:p-4 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center mx-auto mb-2 md:mb-3 shadow-lg">
              <span className="text-xl md:text-2xl font-bold text-gray-800">🚀</span>
            </div>
            <p className="text-gray-700 font-semibold text-sm md:text-base">Improve Fast</p>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center">
        <UploadBox />
      </div>
    </div>
  );
};

export default Home;