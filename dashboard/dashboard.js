const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const revenueData = [105000, 115000, 123000, 132000, 146000, 158000, 169000, 180000, 192000, 205000, 218000, 235000];
const salesRegionLabels = ["North", "South", "East", "West", "International"];
const salesRegionData = [320, 210, 150, 180, 95];
const categoryLabels = ["Electronics", "Home", "Apparel", "Accessories", "Services"];
const categoryShareData = [36, 22, 18, 14, 10];
const targetLabels = ["Q1", "Q2", "Q3", "Q4"];
const targetActual = [98000, 125000, 142000, 168000];
const targetGoal = [92000, 118000, 138000, 160000];
const engagementLabels = ["Visits", "Clicks", "Leads", "Trials", "Purchases"];
const engagementData = [8400, 5200, 1900, 1300, 720];
const engagementConversion = [62, 44, 32, 28, 16];

function createChart(selector, config) {
  const ctx = document.getElementById(selector).getContext("2d");
  return new Chart(ctx, config);
}

createChart("revenueTrend", {
  type: "line",
  data: {
    labels: months,
    datasets: [
      {
        label: "Revenue",
        data: revenueData,
        borderColor: "#38bdf8",
        backgroundColor: "rgba(56, 189, 248, 0.18)",
        fill: true,
        tension: 0.35,
        pointRadius: 4,
        pointBackgroundColor: "#38bdf8",
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: { grid: { color: "rgba(148,163,184,0.12)" } },
      y: { ticks: { callback: (value) => `$${value / 1000}k` }, grid: { color: "rgba(148,163,184,0.12)" } },
    },
  },
});

createChart("salesRegion", {
  type: "bar",
  data: {
    labels: salesRegionLabels,
    datasets: [
      {
        label: "Units Sold",
        data: salesRegionData,
        backgroundColor: ["#60a5fa", "#38bdf8", "#22c55e", "#f97316", "#a855f7"],
        borderRadius: 12,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, grid: { color: "rgba(148,163,184,0.12)" } },
    },
  },
});

createChart("categoryShare", {
  type: "doughnut",
  data: {
    labels: categoryLabels,
    datasets: [
      {
        data: categoryShareData,
        backgroundColor: ["#38bdf8", "#22c55e", "#facc15", "#fb7185", "#8b5cf6"],
        hoverOffset: 10,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: { legend: { position: "bottom", labels: { color: "#cbd5e1" } } },
  },
});

createChart("quarterlyTargets", {
  type: "radar",
  data: {
    labels: targetLabels,
    datasets: [
      {
        label: "Goal",
        data: targetGoal,
        borderColor: "rgba(56, 189, 248, 0.8)",
        backgroundColor: "rgba(56, 189, 248, 0.18)",
        fill: true,
      },
      {
        label: "Actual",
        data: targetActual,
        borderColor: "rgba(34, 197, 94, 0.9)",
        backgroundColor: "rgba(34, 197, 94, 0.18)",
        fill: true,
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      r: {
        angleLines: { color: "rgba(148,163,184,0.18)" },
        grid: { color: "rgba(148,163,184,0.14)" },
        pointLabels: { color: "#cbd5e1" },
        ticks: { display: false },
      },
    },
  },
});

createChart("customerEngagement", {
  type: "bar",
  data: {
    labels: engagementLabels,
    datasets: [
      {
        label: "Engagement Actions",
        data: engagementData,
        backgroundColor: ["#38bdf8", "#0ea5e9", "#22c55e", "#f97316", "#a855f7"],
        borderRadius: 12,
      },
      {
        label: "Conversion %",
        data: engagementConversion,
        type: "line",
        borderColor: "#facc15",
        backgroundColor: "rgba(250, 204, 21, 0.2)",
        tension: 0.35,
        pointRadius: 5,
        yAxisID: "conversion",
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: { labels: { color: "#cbd5e1" } },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        beginAtZero: true,
        grid: { color: "rgba(148,163,184,0.12)" },
        title: { display: true, text: "Actions", color: "#cbd5e1" },
      },
      conversion: {
        position: "right",
        beginAtZero: true,
        max: 100,
        grid: { display: false },
        ticks: { callback: (value) => `${value}%`, color: "#cbd5e1" },
        title: { display: true, text: "Conversion %", color: "#cbd5e1" },
      },
    },
  },
});
