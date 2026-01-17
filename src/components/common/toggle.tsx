import { useRef, useState } from "react";

const StatusToggle = ({ row, onToggle }: any) => {
  const isProcessingRef = useRef(false);
  const [loading, setLoading] = useState(false);

  const handleChange = () => {
    if (isProcessingRef.current) return;

    isProcessingRef.current = true;
    setLoading(true);

    onToggle(row);

    setTimeout(() => {
      isProcessingRef.current = false;
      setLoading(false);
    }, 1500);
  };

  return (
    <label
      className={`relative inline-flex items-center ${
        loading ? "cursor-wait" : "cursor-pointer"
      }`}
    >
      <input
        type="checkbox"
        className="sr-only peer"
        checked={row.active === true}
        onChange={handleChange}
        disabled={loading}
      />

      <div
        className={`z-0 group peer bg-white rounded-full duration-300 w-8 h-4
        ring-1 ring-[#E7EEF5] p-[2px]
        after:duration-300 after:bg-black after:rounded-full
        after:absolute after:h-3 after:w-3 after:top-[2px] after:left-[2px]
        after:flex after:justify-center after:items-center
        peer-checked:after:translate-x-4
        peer-hover:after:scale-95
        ${
          row.status === true
            ? "peer-checked:bg-[#E7EEF5] peer-checked:ring-[#E7EEF5]"
            : "peer-checked:bg-[#E7EEF5]"
        }`}
      />
    </label>
  );
};

export default StatusToggle;
