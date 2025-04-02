import { motion, AnimatePresence } from "framer-motion";

const units = {
  air_flow_rate: "m³/min",
  compressor_temp: "°C",
  cycle_time: "s",
  cylinder_temp: "°C",
  force_applied: "N",
  motor_power_kW: "kW",
  noise_level: "dB",
  pressure_psi: "psi",
  stroke_length: "mm",
  valve_response_time: "ms",
  vibration_level: "mm/s²",
};

export default function Card({ title, value }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
    >
      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {title.replace(/_/g, " ")}
      </h5>

      <AnimatePresence>
        <motion.p
          key={value}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className="font-normal text-gray-700 dark:text-gray-400 text-xl"
        >
          {value} {units[title] || ""}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  );
}
