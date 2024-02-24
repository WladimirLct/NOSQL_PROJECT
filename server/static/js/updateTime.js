const dayElement = document.getElementById("day");
const timeElement = document.getElementById("time");
const monthElement = document.getElementById("month");

function updateTime() {
    const now = new Date();
  
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    dayElement.textContent = days[now.getDay()].toString() + ",";
    timeElement.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    monthElement.textContent = "Today, "+ now.toLocaleString('default', { month: 'short' }).toString() + " " + now.getDate().toString();
}

updateTime();
setInterval(updateTime, 1000);