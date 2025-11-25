const form = document.getElementById("attendanceForm");
const tableBody = document.querySelector("#studentTable tbody");
const chartCtx = document.getElementById("attendanceChart").getContext("2d");

let students = JSON.parse(localStorage.getItem("students")) || [];
let attendanceChart;

// Handle form submission
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const attended = parseInt(document.getElementById("attended").value);
  const total = parseInt(document.getElementById("total").value);

  if (!name || total <= 0 || attended < 0 || attended > total) {
    alert("Please enter valid numbers.");
    return;
  }

  const percentage = ((attended / total) * 100).toFixed(2);
  const status = percentage >= 70 ? "Above 70%" : "Below 70%";

  students.push({ name, attended, total, percentage, status });
  localStorage.setItem("students", JSON.stringify(students));

  form.reset();
  displayStudents();
});

// Display students in the table
function displayStudents() {
  tableBody.innerHTML = "";

  students.forEach((s, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${s.name}</td>
      <td>${s.attended}</td>
      <td>${s.total}</td>
      <td>${s.percentage}%</td>
      <td class="${s.percentage >= 70 ? "status-pass" : "status-fail"}">${s.status}</td>
      <td><button class="view-btn" onclick="viewChart(${index})">📊 View</button></td>
    `;
    tableBody.appendChild(row);
  });
}

// View individual student chart
function viewChart(index) {
  const s = students[index];
  const missed = s.total - s.attended;

  if (attendanceChart) attendanceChart.destroy();

  attendanceChart = new Chart(chartCtx, {
    type: "doughnut",
    data: {
      labels: ["Attended", "Missed"],
      datasets: [{
        data: [s.attended, missed],
        backgroundColor: ["#3fb950", "#f85149"]
      }]
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: `${s.name}'s Attendance (${s.percentage}%)`,
          color: "#fff",
          font: { size: 18 }
        },
        legend: {
          labels: { color: "#fff" }
        }
      }
    }
  });
}

// Load saved students on page load
displayStudents();
