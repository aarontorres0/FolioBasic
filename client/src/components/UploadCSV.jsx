import Papa from "papaparse";
import { useRef, useState } from "react";
import { useAppContext } from "../AppContext";

const UploadCSV = () => {
  const { setPortfolioData } = useAppContext();
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
          setPortfolioData(groupedData);
          fileInputRef.current.value = "";
        }
      },
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="hidden"
      />
      <button
        onClick={triggerFileInput}
        className="btn btn-sm btn-neutral text-white w-full justify-start hover:btn-active opacity-80 transition-opacity duration-300"
      >
        Upload CSV File
      </button>
      {error && <p className="text-error text-sm mt-1">{error}</p>}
    </>
  );
};

export default UploadCSV;
