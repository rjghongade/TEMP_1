import { useEffect, useState } from "react";
import config from "../../config";

const AmenitiesSection = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${config.API_URL}/amenities?website=${config.SLUG_URL}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch amenities");
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <div className="text-center py-6 text-red-500 text-lg">
        Error: {error}
      </div>
    );
  }

  if (!data) {
    return <div className="text-center py-6 text-gray-400 text-lg">Loading...</div>;
  }

  return (
    <section id="AmenitiesSection" className="w-full py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-extrabold text-yellow-400 mb-6">
          {data.amenities.page.heading}
        </h2>
        
        {data.amenities.page.subheading && (
          <p className="text-lg text-gray-300 mb-12">{data.amenities.page.subheading}</p>
        )}

        {/* Amenities Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {data.amenities.amenities.map((amenity) => (
            <div
              key={amenity.id}
              className="bg-gray-800 bg-opacity-90 p-6 rounded-xl shadow-lg flex flex-col items-center transition-all duration-300 transform hover:scale-105 hover:bg-gray-700"
            >
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-yellow-500 mb-4 shadow-md">
                <img
                  src={amenity.property_amenities_photo}
                  alt={amenity.amenity_name}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-xl font-semibold text-yellow-400 mb-2">{amenity.amenity_name}</h3>
              <p className="text-gray-400 text-sm">Updated: {new Date(amenity.updated_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AmenitiesSection;
