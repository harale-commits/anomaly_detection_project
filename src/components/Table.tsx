export default function Table({ machineData, shapResults, anomalyStatus }) {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-6">
      <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700">
        <thead className="text-xs uppercase bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-300">
          <tr>
            <th scope="col" className="px-6 py-3">
              Sensor
            </th>
            <th scope="col" className="px-6 py-3">
              Machine Values
            </th>
            <th scope="col" className="px-6 py-3">
              SHAP Results
            </th>
            <th scope="col" className="px-6 py-3">
              SHAP Explanation
            </th>
          
          </tr>
        </thead>
        <tbody>
          {Object.keys(machineData).map((sensor, index) => {
            const shapValue = shapResults[sensor] || 0;
            const explanation =
              shapValue >= -1 && shapValue <= 1
                ? "✅ Sensor is working fine"
                : "⚠️ Potential issue detected";

            return (
              <tr
                key={index}
                className="border-b border-gray-300 dark:border-gray-700"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 dark:text-gray-300"
                >
                  {sensor.replace(/_/g, " ")}
                </th>
                <td className="px-6 py-4">{machineData[sensor]}</td>
                <td className="px-6 py-4">{shapValue.toFixed(4)}</td>
                <td className="px-6 py-4">{explanation}</td>
               
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
