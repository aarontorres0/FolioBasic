import Papa from "papaparse";
import { useRef, useState } from "react";

const UploadCSV = ({ onUpload }) => {
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        if (result.errors.length) {
          setError("Invalid CSV format");
        } else {
          const groupedData = result.data.reduce((acc, row) => {
            if (!acc[row.Account]) {
              acc[row.Account] = [];
            }
            acc[row.Account].push(row);
            return acc;
          }, {});
          setError(null);
          onUpload(groupedData);
          fileInputRef.current.value = "";
        }
      },
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="py-4">
      <div className="form-control">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="hidden" // Hide the default file input
        />
        <button
          onClick={triggerFileInput}
          className="btn btn-active btn-accent text-white hover:opacity-80 transition-opacity duration-300"
        >
          Upload CSV File
        </button>
        {error && <p className="text-center text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default UploadCSV;
