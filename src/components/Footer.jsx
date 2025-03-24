import React, { useState, useEffect } from "react";
import {
  Facebook,
  Linkedin,
  Instagram,
  Youtube,
  Twitter,
  Mail,
  Phone,
  MapPin,
  ChevronUp,
  AlertTriangle,
  Loader,
} from "lucide-react";
import config from "../../config";

const Footer = () => {
  const [footerData, setFooterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${config.API_URL}/footer?website=${config.SLUG_URL}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch footer data");
        }

        const data = await response.json();
        setFooterData(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching footer data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchFooterData();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const getSocialIcon = (iconName) => {
    const iconMap = {
      "fab fa-facebook-f": <Facebook size={18} />,
      "fab fa-linkedin-in": <Linkedin size={18} />,
      "fab fa-instagram": <Instagram size={18} />,
      "fab fa-youtube": <Youtube size={18} />,
      "fab fa-twitter": <Twitter size={18} />,
    };
    return iconMap[iconName] || <AlertTriangle size={18} />;
  };

  if (loading) {
    return (
      <div className="bg-gray-900 p-8 flex items-center justify-center min-h-[200px]">
        <Loader size={30} className="text-purple-400 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 p-8">
        <div className="bg-yellow-900/20 p-4 rounded-lg text-yellow-400">
          <p>Failed to load footer data: {error}</p>
        </div>
      </div>
    );
  }

  const { social_icons, g_setting } = footerData;

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black bg-opacity-90 backdrop-blur-md text-gray-300 border-t border-gray-700">
      <div className="container mx-auto px-6 py-10 max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        <div>
          {g_setting.logo && (
            <img
              src={g_setting.logo}
              alt="Company Logo"
              className="h-12 w-auto mx-auto md:mx-0"
            />
          )}
          <p className="mt-3 text-sm text-gray-400">{g_setting.footer_disclamer}</p>
        </div>

        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <a href="#projects" className="text-gray-400 hover:text-purple-400">Our Projects</a>
            </li>
            <li>
              <a href="#about" className="text-gray-400 hover:text-purple-400">Why Choose Us</a>
            </li>
            <li>
              <a href="#contact" className="text-gray-400 hover:text-purple-400">Contact Us</a>
            </li>
          </ul>
        </div>

        <div className="relative">
          <div className="text-center md:text-left">
            <h3 className="text-white text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center justify-center md:justify-start">
                <Phone size={16} className="text-purple-400 mr-2" />
                <a href={`tel:${g_setting.footer_phone}`} className="text-gray-400 hover:text-purple-400">
                  {g_setting.footer_phone}
                </a>
              </li>
            </ul>
          </div>

          {/* Agent Rera Text */}
          <div className="absolute bottom-0 left-0 mb-4 ml-4 text-gray-500 text-xs">
            Agent Rera: {g_setting.footer_agent_rera}
          </div>
        </div>

      </div>

      <div className="bg-black/70 py-4">
        <div className="container mx-auto max-w-7xl text-center">
          <div className="flex justify-center space-x-4 mb-4">
            {social_icons.map((icon) => (
              <a
                key={icon.id}
                href={icon.social_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r  to-yellow-600 hover:from-yellow-700 transition-all"
              >
                {getSocialIcon(icon.social_icon)}
              </a>
            ))}
          </div>
          <p className="text-xs text-gray-500">{g_setting.footer_copyright}</p>
        </div>
      </div>

      <button
        onClick={scrollToTop}
        className="fixed bottom-6 left-6 w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r  to-yellow-600 hover:from-yellow-700 hover:to-indigo-700 active:from-purple-800 active:to-indigo-800  text-white shadow-lg transition-all"
      >
        <ChevronUp size={20} />
      </button>
    </footer>
  );
};

export default Footer;