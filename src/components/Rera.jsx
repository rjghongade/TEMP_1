import React, { useState, useEffect } from "react";
import {
  Calendar,
  Building,
  FileText,
  ExternalLink,
  Layers,
  Map,
  Home,
  Loader,
  AlertTriangle,
} from "lucide-react";
import { ContactDialog } from "./Contact";
import config from "../../config";

const ReraInformation = () => {
  const [reraData, setReraData] = useState(null);
  const [pageInfo, setPageInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);

  useEffect(() => {
    const fetchReraData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${config.API_URL}/rera?website=${config.SLUG_URL}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch RERA data");
        }

        const data = await response.json();
        setPageInfo(data.page[0]);
        setReraData(data.rera[0]);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching RERA data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchReraData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-[300px] flex items-center justify-center bg-gray-900">
        <Loader size={30} className="text-purple-400 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[300px] flex items-center justify-center bg-gray-900 text-yellow-400">
        <AlertTriangle size={24} className="mr-2" />
        <p>Failed to load RERA information: {error}</p>
      </div>
    );
  }

  if (!reraData) return;

  return (
    <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 py-16 px-6 text-white" id="about">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-yellow-400 drop-shadow-lg">
            {pageInfo?.heading || "RERA Information"}
          </h2>
          {pageInfo?.subheading && <p className="text-gray-300 mt-2">{pageInfo.subheading}</p>}
        </div>

        <div className="bg-gray-800 rounded-xl shadow-xl p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 via-transparent to-yellow-900/30 opacity-50" />

          <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
            <div>
              <h3 className="text-2xl font-semibold text-yellow-300">{reraData.phase_name}</h3>
              <p className="text-gray-300 mt-1 flex items-center">
                <FileText size={16} className="mr-2 text-yellow-400" /> RERA ID: {reraData.rera_id}
              </p>
            </div>
            <a
              href={reraData.rera_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 text-white font-medium bg-yellow-600 hover:bg-yellow-700 rounded-lg flex items-center transition-all duration-300 shadow-lg hover:shadow-yellow-600/50"
            >
              Verify on RERA <ExternalLink size={16} className="ml-2" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {[
            { label: "Completion Date", value: formatDate(reraData.completion_date), icon: <Calendar /> },
            { label: "Project Area", value: `${reraData.total_area} sq.m (${reraData.total_acre} Acre)`, icon: <Map /> },
            { label: "Total Towers", value: reraData.total_tower, icon: <Building /> },
            { label: "Total Units", value: reraData.total_units, icon: <Home /> },
          ].map((item, index) => (
            <div
              key={index}
              className="p-6 bg-gray-800 rounded-lg border border-gray-700 shadow-lg transform hover:scale-105 transition duration-300 flex items-center gap-4"
            >
              <div className="p-3 bg-black/80 rounded-lg text-yellow-400">{item.icon}</div>
              <div>
                <p className="text-gray-300 text-sm">{item.label}</p>
                <h4 className="text-yellow-300 font-semibold text-lg">{item.value}</h4>
              </div>
            </div>
          ))}
        </div>

      </div>

      <ContactDialog isOpen={isOpen} onClose={closeDialog} />
    </div>
  );
};

export default ReraInformation;