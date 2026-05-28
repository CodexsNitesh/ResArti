const AnalysisCard = ({ title, content }) => {
  const getCardColor = (title) => {
    const colorMap = {
      "ATS Score": "from-primary-500 to-primary-600",
      "Strengths": "from-green-500 to-green-600",
      "Weaknesses": "from-red-500 to-red-600",
      "Missing Skills": "from-accent-500 to-accent-600",
      "Interview Questions": "from-blue-500 to-blue-600",
      "Career Suggestions": "from-purple-500 to-purple-600",
    };
    return colorMap[title] || "from-primary-500 to-primary-600";
  };

  const getEmojiForTitle = (title) => {
    const emojiMap = {
      "ATS Score": "📊",
      "Strengths": "⭐",
      "Weaknesses": "⚠️",
      "Missing Skills": "📚",
      "Interview Questions": "❓",
      "Career Suggestions": "🚀",
    };
    return emojiMap[title] || "�";
  };

  return (
    <div className="bg-white border-2 border-gray-100 rounded-xl md:rounded-2xl p-4 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
      <div className={`bg-gradient-to-br ${getCardColor(title)} rounded-lg md:rounded-xl p-3 md:p-4 mb-4 md:mb-6 inline-block`}>
        <h2 className="text-lg sm:text-xl md:text-3xl font-bold text-white">
          {getEmojiForTitle(title)} <span className="text-base md:text-lg md:inline">{title}</span>
        </h2>
      </div>

      <div className="text-gray-700 whitespace-pre-wrap space-y-2 md:space-y-3">
        {Array.isArray(content) ? (
          <ul className="space-y-2 md:space-y-3">
            {content.map((item, index) => (
              <li key={index} className="flex gap-2 md:gap-3 items-start">
                <span className="text-primary-500 font-bold text-lg md:text-lg mt-0.5 flex-shrink-0">•</span>
                <span className="text-gray-800 text-sm md:text-base">{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-800 leading-relaxed text-sm md:text-base">{content}</p>
        )}
      </div>
    </div>
  );
};

export default AnalysisCard;