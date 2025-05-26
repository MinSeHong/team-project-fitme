import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

function ChartApp({ocrData = {}}) {
  const data = {
    labels: ['체중', '골격근량', '체지방량', 'BMI', '체지방률'],
    datasets: [
      {
        label: '인바디_OCR',
        data: [
          ocrData[0] || 0,
          ocrData[1] || 0,
          ocrData[2] || 0,
          ocrData[3] || 0,
          ocrData[4] || 0
        ],
        pointRadius: 2,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,

      },
    ],
  };
  const options = {
    scales: {
      r: {
        angleLines: {
          display: false
        },
        min: 0,
        max: 80,
        ticks: {
          stepSize: 10
        }
      }
    }
  };

  return <Radar data={data} options={options} />;
}

export default ChartApp;
