import React, { useEffect, useState, useRef } from "react";
import config from "../../config";

const MasterLayout = () => {
  const [masterLayout, setMasterLayout] = useState(null);
  const [heading, setHeading] = useState("");
  const [zoom, setZoom] = useState(1);
  const imageRef = useRef(null);

  useEffect(() => {
    fetch(`${config.API_URL}/master-layout?website=${config.SLUG_URL}`)
      .then((response) => response.json())
      .then((data) => {
        setHeading(data.page?.[0]?.heading || "Master Layout");
        setMasterLayout(data.master_layout?.[0] || null);
      })
      .catch((error) => console.error("Error fetching master layout:", error));
  }, []);

  const zoomIn = () => setZoom((prevZoom) => Math.min(prevZoom + 0.2, 2));
  const zoomOut = () => setZoom((prevZoom) => Math.max(prevZoom - 0.2, 1));

  return (
    <section id="MasterLayout" className="bg-gradient-to-br from-black via-gray-900 to-gray-800 py-16 px-6 text-white">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold text-yellow-400 mb-8">
          {heading}
        </h2>

        {masterLayout ? (
          <div className="relative bg-gray-800 bg-opacity-80 backdrop-blur-md shadow-2xl rounded-xl overflow-hidden p-8">
            {/* Image Container with Zoom Controls */}
            <div className="relative group mb-6">
              <div className="flex justify-center items-center">
                <img
                  ref={imageRef}
                  src={masterLayout.layout_image}
                  alt={masterLayout.layout_name}
                  className="w-full max-h-[500px] object-contain transition-transform duration-300"
                  style={{ transform: `scale(${zoom})` }}
                />
              </div>
              {/* Zoom Controls */}
              <div className="absolute bottom-4 right-4 flex space-x-2 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={zoomIn}
                  className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-3 py-2 rounded-lg shadow-lg"
                >
                  🔍+
                </button>
                <button
                  onClick={zoomOut}
                  className="bg-gray-600 hover:bg-gray-500 text-white font-semibold px-3 py-2 rounded-lg shadow-lg"
                >
                  🔍-
                </button>
              </div>
            </div>

            {/* Layout Details */}
            <div className="text-left">
              <h3 className="text-3xl font-semibold text-yellow-400">
                {masterLayout.layout_name}
              </h3>

              {masterLayout.unit_layout_heading && (
                <p className="text-gray-300 mt-4">
                  <strong className="text-yellow-300">Heading:</strong> {masterLayout.unit_layout_heading}
                </p>
              )}

              {masterLayout.unit_layout_carpet_area && (
                <p className="text-gray-300 mt-4">
                  <strong className="text-yellow-300">Carpet Area:</strong> {masterLayout.unit_layout_carpet_area}
                </p>
              )}

              {masterLayout.unit_layout_price && (
                <p className="text-gray-300 mt-4">
                  <strong className="text-yellow-300">Price:</strong> ₹{masterLayout.unit_layout_price}
                </p>
              )}

              {masterLayout.unit_layout_description && (
                <p className="text-gray-300 mt-4">
                  <strong className="text-yellow-300">Description:</strong> {masterLayout.unit_layout_description}
                </p>
              )}

              <p className="text-gray-400 text-sm mt-6">
                <strong className="text-yellow-300">Updated At:</strong>{" "}
                {new Date(masterLayout.updated_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-400 text-lg">No master layout available.</p>
        )}
      </div>
    </section>
  );
};

export default MasterLayout;
