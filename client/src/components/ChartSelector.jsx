const ChartSelector = ({ availableCharts, selectedCharts, onSelectChart }) => {
  return (
    <div className="my-4">
      <div className="flex flex-wrap gap-2">
        {availableCharts.map((chart) => (
          <button
            key={chart.id}
            className={`btn btn-sm ${
              selectedCharts.includes(chart.id) ? "btn-primary text-white" : "btn-outline"
            }`}
            onClick={() => onSelectChart(chart.id)}
          >
            {chart.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChartSelector;
