import React, { useState, useEffect } from "react";
import { ChevronRight, HelpCircle, AlertCircle, Loader } from "lucide-react";
import config from "../../config";

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [heading, setHeading] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeAnswer, setActiveAnswer] = useState("");

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${config.API_URL}/faq?website=${config.SLUG_URL}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch FAQ data");
        }

        const data = await response.json();
        setFaqs(data.faqs);
        setHeading(data.page[0]?.heading || "Frequently Asked Questions");
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  const handleQuestionClick = (answer) => {
    setActiveAnswer(stripHtml(answer));
  };

  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  if (loading) {
    return (
      <div className="bg-gray-900 min-h-[300px] p-8 flex items-center justify-center">
        <Loader size={30} className="text-purple-400 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 min-h-[300px] p-8">
        <div className="bg-yellow-900/20 p-4 rounded-lg text-yellow-400 flex items-center gap-3">
          <AlertCircle size={20} />
          <p>Failed to load FAQs: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center justify-center gap-3 mb-2">
        </div>
        <h2 className="text-3xl font-bold text-yellow-400 text-center">{heading}</h2>
        <p className="text-yellow-400 text-center mt-3 max-w-2xl mx-auto">
          Find answers to commonly asked questions about Ceratec Tower 1o8 Balewadi
        </p>
      </div>

      {/* Two-Column FAQ Layout */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {faqs.map((faq, index) => (
          <button
            key={faq.id}
            onClick={() => handleQuestionClick(faq.faq_content)}
            className="flex items-center gap-4 p-4 bg-gray-800/60 border border-gray-700 rounded-lg text-left transition-all hover:bg-gray-700 hover:border-purple-500"
          >
            <ChevronRight className="text-yellow-400" />
            <span className="text-yellow-200 font-medium text-lg">
              {faq.faq_title}
            </span>
          </button>
        ))}
      </div>

      {/* Answer Display */}
      {activeAnswer && (
        <div className="mt-8 p-6 bg-gray-800/60 border-l-4 border-yellow-500 rounded-lg text-yellow-300 text-lg max-w-3xl mx-auto">
          {activeAnswer}
        </div>
      )}
    </div>
  );
};

export default FAQ;
