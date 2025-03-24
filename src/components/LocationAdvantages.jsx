import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  MapPin,
  Loader,
  LocateFixed,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Train,
  Building,
  ShoppingBag,
  Briefcase,
  GraduationCap,
  Landmark,
  TrainFront,
  Plane,
} from "lucide-react";
import { ContactDialog } from "./Contact";
import config from "../../config";

const LocationAdvantages = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isOpen, setIsOpen] = useState(false);
  const slideContainerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${config.API_URL}/location-advantages?website=${config.SLUG_URL}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch location data");
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setVisibleCount(window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const locationAdvantages = data?.location_advantages || [];
  const heading = data?.page?.[0]?.heading || "Location Highlights";

  const extendedLocations = useMemo(() => {
    if (locationAdvantages.length === 0) return [];
    return [
      locationAdvantages[locationAdvantages.length - 1],
      ...locationAdvantages,
      locationAdvantages[0],
    ];
  }, [locationAdvantages]);

  const nextSlide = () => setCurrentIndex((prev) => prev + 1);
  const prevSlide = () => setCurrentIndex((prev) => prev - 1);

  const handleTransitionEnd = () => {
    if (currentIndex === 0) {
      setTransitionEnabled(false);
      setCurrentIndex(extendedLocations.length - 2);
      setTimeout(() => setTransitionEnabled(true), 50);
    } else if (currentIndex === extendedLocations.length - 1) {
      setTransitionEnabled(false);
      setCurrentIndex(1);
      setTimeout(() => setTransitionEnabled(true), 50);
    }
  };

  const transformValue = `translateX(-${(currentIndex * 100) / visibleCount}%)`;

  return (
    <div className="bg-gray-900 p-8">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader size={30} className="text-purple-400 animate-spin" />
        </div>
      ) : error ? (
        <div className="text-yellow-400 text-center">Failed to load location data: {error}</div>
      ) : (
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">{heading}</h2>
            <div className="w-24 h-1 bg-purple-600 mx-auto rounded-full"></div>
          </div>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-medium text-gray-200">Strategic Location <span className="text-purple-400">Advantages</span></h3>
            <div className="flex gap-2">
              <button onClick={prevSlide} className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300">
                <ChevronLeft size={20} />
              </button>
              <button onClick={nextSlide} className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-500"
              style={{ transform: transformValue }}
              onTransitionEnd={handleTransitionEnd}
            >
              {extendedLocations.map((item, index) => (
                <div key={index} className={`w-full sm:w-1/2 lg:w-1/3 px-3`}>
                  <div className="bg-gray-800/60 rounded-lg p-6 border border-gray-700 hover:border-purple-500 transition">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 flex items-center justify-center bg-black/80 rounded-full">
                        <MapPin size={24} className="text-purple-400" />
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-white">{item.location}</h4>
                        <p className="text-gray-400 text-sm">{item.distance}</p>
                      </div>
                    </div>
                    <p className="text-gray-300 mb-4">{item.description}</p>
                    <a href="#" className="text-purple-400 flex items-center hover:underline">
                      View on map <ExternalLink size={14} className="ml-1" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center mt-4">
            {locationAdvantages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index + 1)}
                className={`h-2 w-2 mx-1 rounded-full ${currentIndex - 1 === index ? "bg-purple-500" : "bg-gray-600"}`}
              />
            ))}
          </div>
        </div>
      )}
      <ContactDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

export default LocationAdvantages;
