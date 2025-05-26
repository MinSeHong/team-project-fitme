import React from 'react';
import { Doughnut } from 'react-chartjs-2';

const DoughnutChart = () => {
  // Doughnut 차트에 표시할 데이터
  const data = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: 'My First Dataset',
        data: [300, 50, 100, 40, 120, 80],
        backgroundColor: [
          'red',
          'blue',
          'yellow',
          'green',
          'purple',
          'orange'
        ],
        hoverOffset: 4
      }
    ]
  };

  return (
    <div>
      <h2>Doughnut Chart Example</h2>
      <Doughnut data={data} />
    </div>
  );
};

export default DoughnutChart;