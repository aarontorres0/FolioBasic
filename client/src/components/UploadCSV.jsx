import { useState } from 'react';
import Papa from 'papaparse';

const UploadCSV = ({ onUpload }) => {
  const [error, setError] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Parse CSV file
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        if (result.errors.length) {
          setError('Invalid CSV format');
        } else {
          setError(null);
          onUpload(result.data); // Pass parsed data to parent
        }
      },
    });
  };

  return (
    <div className="p-4">
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="file-input file-input-bordered"
      />
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default UploadCSV;
