const services = [
  {
    id: "sports",
    name: "Sports Recovery Session",
    category: "Fitness",
    duration: 60,
    price: 95,
    description: "Targeted therapy for athletes focusing on muscle recovery and flexibility.",
  },
  {
    id: "training",
    name: "Personal Training Session",
    category: "Fitness",
    duration: 60,
    price: 75,
    description: "One-on-one fitness coaching tailored to your goals.",
  },
  {
    id: "swedish",
    name: "Swedish Massage",
    category: "Massage",
    duration: 60,
    price: 85,
    description: "Relaxing full-body massage to ease tension and promote wellness.",
  },
  {
    id: "deep",
    name: "Deep Tissue Massage",
    category: "Massage",
    duration: 90,
    price: 120,
    description: "Intensive massage targeting deep muscle layers for chronic pain relief.",
  },
];

const timeSlots = ["09:00 AM", "09:30 AM", "10:00 AM", "11:00 AM", "11:30 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:30 PM", "4:00 PM", "4:30 PM"];

function seedAvailability() {
  const map = {};
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const seedDays = [2, 3, 5, 6, 8, 9, 11];
  seedDays.forEach((offset, idx) => {
    const date = new Date(now);
    date.setDate(now.getDate() + offset);
    map[formatDateKey(date)] = timeSlots.slice(idx % 2 === 0 ? 0 : 2, idx % 2 === 0 ? 9 : 11);
  });
  return map;
}

let availability = seedAvailability();

let selectedService = services[0].id;
let selectedDate = Object.keys(availability)[0];
let selectedTime = availability[selectedDate]?.[0] ?? timeSlots[0];

const serviceList = document.getElementById("serviceList");
const calendarGrid = document.getElementById("calendarGrid");
const calendarMonth = document.getElementById("calendarMonth");
const timeGrid = document.getElementById("timeGrid");
const summary = document.getElementById("summary");
const confirmBtn = document.getElementById("confirmBtn");
const form = document.getElementById("bookingForm");

function setCalendarStatus(message) {
  calendarGrid.innerHTML = `<div class="muted" style="grid-column: 1 / -1; padding: 10px 0">${message}</div>`;
}

function setTimeStatus(message) {
  timeGrid.innerHTML = `<div class="muted">${message}</div>`;
}

function formatDateKey(date) {
  return date.toISOString().split("T")[0];
}

function formatDisplayDate(key) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
}

function renderServices() {
  serviceList.innerHTML = "";
  services.forEach((service) => {
    const wrapper = document.createElement("div");
    wrapper.className = "service-card";
    wrapper.innerHTML = `
      <div class="service-main">
        <div class="service-title">${service.name}</div>
        <div class="muted">${service.description}</div>
        <div class="service-meta">
          <span>${service.duration} min</span>
          <span>$${service.price}</span>
          <span class="tag">${service.category}</span>
        </div>
      </div>
      <button class="select-btn ${selectedService === service.id ? "selected" : ""}" data-id="${service.id}">
        ${selectedService === service.id ? "Selected" : "Select"}
      </button>
    `;
    serviceList.appendChild(wrapper);
  });
}

function renderCalendar() {
  if (!Object.keys(availability).length) {
    setCalendarStatus("No availability loaded.");
    return;
  }
  const availableKeys = Object.keys(availability);
  if (!availableKeys.length) return;
  const firstDate = new Date(availableKeys[0]);
  const monthStart = new Date(firstDate.getFullYear(), firstDate.getMonth(), 1);
  const monthEnd = new Date(firstDate.getFullYear(), firstDate.getMonth() + 1, 0);
  calendarMonth.textContent = monthStart.toLocaleDateString(undefined, { month: "long", year: "numeric" });

  const weekdayLabels = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  calendarGrid.innerHTML = "";
  weekdayLabels.forEach((day) => {
    const cell = document.createElement("div");
    cell.className = "day";
    cell.textContent = day;
    calendarGrid.appendChild(cell);
  });

  for (let i = 0; i < monthStart.getDay(); i++) {
    const spacer = document.createElement("div");
    calendarGrid.appendChild(spacer);
  }

  for (let d = 1; d <= monthEnd.getDate(); d++) {
    const dateObj = new Date(firstDate.getFullYear(), firstDate.getMonth(), d);
    const key = formatDateKey(dateObj);
    const btn = document.createElement("button");
    btn.className = "date-btn";
    btn.textContent = d;
    if (availability[key]) {
      btn.classList.add("available");
      btn.addEventListener("click", () => {
        selectedDate = key;
        selectedTime = availability[key][0];
        renderCalendar();
        renderTimes();
        renderSummary();
      });
    } else {
      btn.disabled = true;
    }
    if (key === selectedDate) {
      btn.classList.add("selected");
    }
    calendarGrid.appendChild(btn);
  }
}

function renderTimes() {
  const slots = availability[selectedDate] || [];
  timeGrid.innerHTML = "";
  if (!slots.length) {
    setTimeStatus("No time slots available for this date.");
    return;
  }
  slots.forEach((time) => {
    const btn = document.createElement("button");
    btn.className = `time-btn ${selectedTime === time ? "selected" : ""}`;
    btn.textContent = time;
    btn.addEventListener("click", () => {
      selectedTime = time;
      renderTimes();
      renderSummary();
    });
    timeGrid.appendChild(btn);
  });
}

function renderSummary() {
  const service = services.find((s) => s.id === selectedService);
  const formatted = formatDisplayDate(selectedDate);
  summary.innerHTML = `
    <div class="label-strong">${service.name}</div>
    <div class="muted">${formatted} at ${selectedTime}</div>
    <div class="muted">Duration: ${service.duration} min</div>
    <div class="label-strong">Total: $${service.price}</div>
  `;
  confirmBtn.textContent = `Confirm Booking — $${service.price}`;
}

async function fetchAvailability() {
  // Placeholder: replace URL with your API endpoint.
  const params = new URLSearchParams({
    start: formatDateKey(new Date()),
    end: formatDateKey(new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)),
  });
  const response = await fetch(`/api/availability?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Availability request failed: ${response.status}`);
  }
  const data = await response.json(); // expected: [{ date: "2025-01-02", slots: ["09:00 AM"] }]
  return Object.fromEntries(data.map(({ date, slots }) => [date, slots]));
}

async function loadAvailability() {
  try {
    setCalendarStatus("Loading availability…");
    setTimeStatus("Loading time slots…");
    const remote = await fetchAvailability();
    if (Object.keys(remote).length) {
      availability = remote;
    }
    const keys = Object.keys(availability);
    if (keys.length) {
      selectedDate = keys[0];
      selectedTime = availability[selectedDate][0];
    }
    renderCalendar();
    renderTimes();
    renderSummary();
  } catch (error) {
    console.error("Availability load failed, using seeded fallback.", error);
    availability = seedAvailability();
    const keys = Object.keys(availability);
    if (keys.length) {
      selectedDate = keys[0];
      selectedTime = availability[selectedDate][0];
    }
    renderCalendar();
    renderTimes();
    renderSummary();
  }
}

async function postBooking(payload) {
  // Placeholder: swap with real booking endpoint.
  const response = await fetch("/api/book", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`Booking failed: ${response.status}`);
  }
  return response.json();
}

serviceList.addEventListener("click", (event) => {
  if (event.target.matches(".select-btn")) {
    selectedService = event.target.dataset.id;
    renderServices();
    renderSummary();
  }
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const service = services.find((s) => s.id === selectedService);
  const payload = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    notes: form.notes.value.trim(),
    service: service.name,
    date: selectedDate,
    time: selectedTime,
    price: service.price,
  };

  if (!payload.name || !payload.email) return;

  confirmBtn.textContent = "Booking…";
  confirmBtn.disabled = true;
  confirmBtn.style.opacity = "0.8";

  postBooking(payload)
    .then(() => {
      confirmBtn.textContent = "Booking Confirmed";
      alert(`Booked: ${payload.service} on ${formatDisplayDate(payload.date)} at ${payload.time}`);
    })
    .catch((error) => {
      console.error(error);
      alert("Unable to book this slot. Please refresh availability and try another time.");
      confirmBtn.textContent = `Confirm Booking — $${service.price}`;
    })
    .finally(() => {
      confirmBtn.disabled = false;
      confirmBtn.style.opacity = "1";
    });
});

renderServices();
loadAvailability();
