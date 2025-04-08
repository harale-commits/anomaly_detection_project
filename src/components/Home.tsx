import { useEffect, useState } from "react";
import axios from "axios";
import Card from "./Card";
import LineChart from "./LineChart";
import Modal from "./Modal";
import OpenAI from "openai";
import Table from "./Table";

const openai = new OpenAI({
  baseURL: "https://",
  apiKey: `${import.meta.env.VITE_DEEPSEEK_API_KEY}`,
  dangerouslyAllowBrowser: true,
});

const API_URL = "http://localhost:5000/last_hour";

export default function Home() {
  const [machineData, setMachineData] = useState({});
  const [shapResults, setShapResults] = useState({});
  const [anomalyStatus, setAnomalyStatus] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [anomalyHistory, setAnomalyHistory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_URL);
        const latestData = response.data.data;

        console.log(latestData);

        if (latestData.length > 0) {
          const lastEntry = latestData[latestData.length - 1];
          setMachineData(lastEntry.machine_data);
          setShapResults(lastEntry.shap_results);
          setAnomalyStatus(lastEntry.anomaly_status);

          // Store last 15 entries for the anomaly history table
          setAnomalyHistory(latestData.slice(-15));

          if (selectedProperty) {
            setChartData(
              latestData.slice(-30).map((entry) => ({
                timestamp: entry.timestamp,
                value: entry.machine_data[selectedProperty],
              }))
            );
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [selectedProperty]);

  const openModal = (property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  return (
    <main className="ml-64 flex-1 h-screen overflow-auto p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Machine Data</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.keys(machineData).length > 0 ? (
          Object.entries(machineData).map(([key, value], index) => (
            <div key={index} onClick={() => openModal(key)}>
              <Card title={key} value={value} />
            </div>
          ))
        ) : (
          <p>Loading data...</p>
        )}
      </div>

      {/* Custom Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedProperty?.replace(/_/g, " ")}
      >
        {chartData.length > 0 ? (
          <LineChart data={chartData} />
        ) : (
          <p>Loading chart...</p>
        )}
      </Modal>

      {/* Table Component with Dynamic Data */}
      <Table
        machineData={machineData}
        shapResults={shapResults}
        anomalyStatus={anomalyStatus}
      />

      {/* Anomaly History Table */}
      {/* Anomaly History Table */}
      <h2 className="text-xl font-bold mt-8 mb-4">Recent Anomaly Status</h2>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700">
          <thead className="text-xs uppercase bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-300">
            <tr>
              <th scope="col" className="px-6 py-3">
                Timestamp
              </th>
              <th scope="col" className="px-6 py-3">
                Anomaly Status
              </th>
              <th scope="col" className="px-6 py-3">
                Explanation
              </th>
            </tr>
          </thead>
          <tbody>
            {anomalyHistory.map((entry, index) => (
              <tr
                key={index}
                className="border-b border-gray-300 dark:border-gray-700"
              >
                <td className="px-6 py-4">
                  {new Date(entry.timestamp).toLocaleString()}
                </td>
                <td className="px-6 py-4">{entry.anomaly_status.toString()}</td>
                <td className="px-6 py-4">
                  {entry.anomaly_status
                    ? "Potential issue detected"
                    : "Machine is working fine"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
