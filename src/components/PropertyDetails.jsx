import { useEffect, useState } from "react";
import config from "../../config";

const PropertyDetails = () => {
  const [property, setProperty] = useState(null);
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    fetch(`${config.API_URL}/propert-details?website=${config.SLUG_URL}`)
      .then((response) => response.json())
      .then((data) => setProperty(data.property_details))
      .catch((error) => console.error("Error fetching property details:", error));
  }, []);

  if (!property) {
    return <p className="text-center text-gray-500">Loading property details...</p>;
  }

  return (
    <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-black py-16 px-6">
      <div className="max-w-6xl mx-auto bg-gray-800 text-white shadow-2xl rounded-xl overflow-hidden">
        {/* Property Image & Info */}
        <div className="flex flex-col md:flex-row items-center gap-8 p-8">
          {/* Property Image */}
          <div className="w-full md:w-1/2 relative">
            <img
              src={property.og_image || "default-image.jpg"}
              alt={property.property_name}
              className="w-full h-80 object-cover rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
            />
            {/* Subtle Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-800 to-transparent opacity-30"></div>
          </div>

          {/* Property Details */}
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-yellow-400">{property.property_name}</h1>
            <p className="text-gray-400 mt-2 text-lg">{property.sub_location}</p>
            <p className="text-2xl font-semibold text-yellow-500 mt-3">₹{property.property_price} Cr</p>

            {/* Property Type Tag */}
            <div className="mt-4">
              <span className="inline-block bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg">
                {property.property_type}
              </span>
            </div>

            {/* Tabs: Info & Description */}
            <div className="mt-6 flex gap-6 border-b border-gray-600 pb-2">
              {["info", "description"].map((tab) => (
                <button
                  key={tab}
                  className={`text-lg font-semibold transition-all duration-300 pb-2 ${
                    activeTab === tab ? "text-yellow-400 border-b-2 border-yellow-400" : "text-gray-400 hover:text-yellow-400"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === "info" ? "Property Info" : "Description"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "info" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
              <p><strong className="text-yellow-400">Builder:</strong> {property.builder_name}</p>
              <p><strong className="text-yellow-400">Size Range:</strong> {property.property_price_range}</p>
              <p><strong className="text-yellow-400">Type:</strong> {property.property_type_price_range}</p>
            </div>
          )}

          {activeTab === "description" && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold text-yellow-400">About the Property</h2>
              <div className="text-gray-300 mt-3 max-h-60 overflow-y-auto p-4 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg shadow-lg">
                <div dangerouslySetInnerHTML={{ __html: property.property_description }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PropertyDetails;
