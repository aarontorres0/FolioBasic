import { useState } from 'react';
import Papa from 'papaparse';

const UploadCSV = ({ onUpload }) => {
  const [error, setError] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        if (result.errors.length) {
          setError('Invalid CSV format');
        } else {
          setError(null);
          onUpload(result.data);
        }
      },
    });
  };

  return (
    <div className="p-4">
      <div className="form-control">
        <label className="label">
        </label>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="file-input file-input-bordered w-full max-w-xs"
        />
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default UploadCSV;
