import React from "react";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Tooltip,
  Filler,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Legend,
  plugins,
  scales,
} from "chart.js";
import { getLast7Days } from "../../libs/features";

ChartJS.register(
  Tooltip,
  Filler,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Legend
);

const labels = getLast7Days();

const LineChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        display: false,
      },
    },
  },
};

const LineChart = ({ value = [{}] }) => {
  const data = {
    labels,
    datasets: [
      {
        data: value,
        label: value.length <= 1 ? "messages" : "messages",
        fill: true,
        borderColor: "rgba(75,12,192,0.8)",
        backgroundColor: "rgba(75,12,192,0.2)",
      },
    ],
  };
  return <Line data={data} options={LineChartOptions} />;
};

const DoughnutChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  cutout: 90,
};

const DoughnutChart = ({ value = [{}], labels = [] }) => {
  const data = {
    labels,
    datasets: [
      {
        data: value,
        borderColor: ["rgba(75,12,192,0.8)", "rgba(158, 12, 255, 0.952)"],
        backgroundColor: ["rgba(75,12,192,0.2)", "rgba(158, 12, 255, 0.952)"],
        offset: 15,
      },
    ],
  };

  return (
    <Doughnut
      style={{
        zIndex: 10,
      }}
      data={data}
      options={DoughnutChartOptions}
    />
  );
};

export { LineChart, DoughnutChart };
