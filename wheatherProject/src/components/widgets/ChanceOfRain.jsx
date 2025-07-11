import { useEffect, useRef, useState } from "react";
import { useGetHourlyForecastQuery } from "../../services/WeatherApi";
import { useSelector } from "react-redux";
import { IoRainy } from "react-icons/io5";
import Chart from "chart.js/auto";

function ChanceOfRain({ data }) {
  if (!data) return null;

  // Chart JS
  const chartRef = useRef(null);
  const [, setChart] = useState(null);

  function convertToHour(dt, timezone) {
    let utc_time = new Date(dt * 1000);
    let local_time = new Date(utc_time.getTime() + timezone * 1000);
    let local_time_format = local_time.toLocaleTimeString("Ko-kr", {
      timeZone: "UTC",
      hour12: true,
      hour: "numeric",
    });
    return local_time_format;
  }

  useEffect(() => {
    if (chartRef.current && data) {
      const timezone = data.city.timezone;
      const hourlyData = data.list.slice(0, 6); // Get the first 6 hourly data points
      const rainData = hourlyData.map(({ dt, pop }) => ({
        time: convertToHour(dt, timezone),
        chanceOfRain: pop * 100,
      }));

      // Create a new chart instance and store it in state
      const newChart = new Chart(chartRef.current, {
        type: "bar",
        data: {
          labels: rainData.map(({ time }) => time),
          datasets: [
            {
              label: "강우확률",
              data: rainData.map(({ chanceOfRain }) => chanceOfRain),
              backgroundColor: "#171717",
              borderWidth: 1,
              borderRadius: Number.MAX_VALUE,
              barThickness: 10,
              minBarLength: 5,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
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
              grid: {
                display: true,
              },
              ticks: {
                beginAtZero: true,
                stepSize: 33,
                callback: function (value) {
                  if (value <= 5) {
                    return "Minimal";
                  } else if (value <= 10) {
                    return "Slight";
                  } else if (value <= 40) {
                    return "Moderate";
                  } else {
                    return "Rainy";
                  }
                },
              },
            },
          },
        },
      });

      return () => {
        setChart(newChart);
        newChart.destroy();
      };
    }
  }, [data]);

  return (
    <>
      {data && (
        <div
          key={`${data.lat},${data.lng}`}
          className="flex h-40 w-full flex-col items-stretch overflow-hidden rounded-3xl bg-white p-4 shadow-lg dark:bg-neutral-800"
        >
          {/* TITLE */}
          <div className="flex flex-row gap-1">
            <IoRainy className="h-4 w-4" />
            <div className="text-xs font-semibold">강수 확률</div>
          </div>
          <div className="h-full w-full py-2">
            <canvas ref={chartRef} className="dark:invert" />
          </div>
        </div>
      )}
    </>
  );
}

export default ChanceOfRain;
