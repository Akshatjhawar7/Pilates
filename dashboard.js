const stats = [
  { label: "Today's Appointments", value: "6", detail: "Starting at 9:00 AM" },
  { label: "Weekly Revenue", value: "$4,820", detail: "+12% vs last week" },
  { label: "Total Clients", value: "184", detail: "6 new this week" },
  { label: "Bookings this month", value: "42", detail: "Avg 4.5 per day" },
];

const appointments = [
  { id: "apt-0900", time: "9:00 AM", client: "Monica Alvarez", service: "Sports Recovery", status: "Checked in", note: "Prefers shoulder focus" },
  { id: "apt-1030", time: "10:30 AM", client: "Evan Greene", service: "Deep Tissue Massage", status: "On deck", note: "" },
  { id: "apt-1200", time: "12:00 PM", client: "Priya Raman", service: "Personal Training", status: "Confirmed", note: "" },
  { id: "apt-1400", time: "2:00 PM", client: "David Lee", service: "Swedish Massage", status: "Confirmed", note: "" },
  { id: "apt-1530", time: "3:30 PM", client: "Jordan Miles", service: "Mobility Session", status: "Confirmed", note: "" },
  { id: "apt-1700", time: "5:00 PM", client: "Taylor Brooks", service: "Yoga Therapy", status: "Confirmed", note: "" },
];

const statusOptions = ["Confirmed", "On deck", "Checked in", "Cancelled"];

const payments = [
  { client: "Monica Alvarez", service: "Sports Recovery", amount: "$95", status: "Paid", date: "Today" },
  { client: "Evan Greene", service: "Deep Tissue", amount: "$120", status: "Pending", date: "Today" },
  { client: "Priya Raman", service: "Personal Training", amount: "$75", status: "Paid", date: "Today" },
  { client: "Samir Malik", service: "Stretch Therapy", amount: "$85", status: "Paid", date: "Yesterday" },
  { client: "Nora Davis", service: "Yoga Therapy", amount: "$110", status: "Paid", date: "Yesterday" },
];

const services = [
  { id: "sports", name: "Sports Recovery Session", duration: "60 min", price: "$95", active: true, type: "Fitness", description: "Targeted recovery for athletes." },
  { id: "deep", name: "Deep Tissue Massage", duration: "90 min", price: "$120", active: true, type: "Massage", description: "Intensive muscle work for chronic pain." },
  { id: "swedish", name: "Swedish Massage", duration: "60 min", price: "$85", active: true, type: "Massage", description: "Relaxing full-body massage to ease tension." },
  { id: "training", name: "Personal Training Session", duration: "60 min", price: "$75", active: false, type: "Fitness", description: "One-on-one fitness coaching." },
  { id: "mobility", name: "Mobility & Stretch Therapy", duration: "45 min", price: "$80", active: true, type: "Fitness", description: "Guided mobility work to increase range." },
];

const clients = [
  { name: "Monica Alvarez", email: "monica@wellness.com", total: "$1,420", status: "vip" },
  { name: "Evan Greene", email: "evan.g@gmail.com", total: "$540", status: "active" },
  { name: "Priya Raman", email: "priya.r@example.com", total: "$620", status: "active" },
  { name: "Jordan Miles", email: "jordan.m@example.com", total: "$210", status: "active" },
  { name: "Nora Davis", email: "nora.d@example.com", total: "$880", status: "vip" },
];

const statsGrid = document.getElementById("statsGrid");
const todayList = document.getElementById("todayList");
const paymentsTable = document.getElementById("paymentsTable");
const servicesList = document.getElementById("servicesList");
const clientsTable = document.getElementById("clientsTable");
const clientSearch = document.getElementById("clientSearch");
const clientFilter = document.getElementById("clientFilter");

const serviceForm = document.getElementById("serviceForm");
const serviceIdInput = document.getElementById("serviceId");
const serviceNameInput = document.getElementById("serviceName");
const servicePriceInput = document.getElementById("servicePrice");
const serviceDurationInput = document.getElementById("serviceDuration");
const serviceCategoryInput = document.getElementById("serviceCategory");
const serviceDescriptionInput = document.getElementById("serviceDescription");
const serviceSubmit = document.getElementById("serviceSubmit");
const serviceCancel = document.getElementById("serviceCancel");

let editingServiceId = null;

function renderStats() {
  statsGrid.innerHTML = stats
    .map(
      (stat) => `
    <div class="stat-card">
      <div class="stat-label">${stat.label}</div>
      <div class="stat-value">${stat.value}</div>
      <div class="muted">${stat.detail}</div>
    </div>
  `
    )
    .join("");
}

function renderAppointments() {
  todayList.innerHTML = appointments
    .map(
      (appt) => `
    <li class="list-item" data-id="${appt.id}">
      <div class="flex-between">
        <div class="label-strong">${appt.time}</div>
        <div style="display:flex; gap:8px; align-items:center">
          <select data-action="status" data-id="${appt.id}" class="input-sm">
            ${statusOptions
              .map((status) => `<option value="${status}" ${status === appt.status ? "selected" : ""}>${status}</option>`)
              .join("")}
          </select>
          <button class="select-btn" data-action="resched" data-id="${appt.id}">Reschedule</button>
          <button class="select-btn" data-action="cancel" data-id="${appt.id}">Cancel</button>
        </div>
      </div>
      <div class="label-strong">${appt.client}</div>
      <div class="muted">${appt.service}</div>
      <div class="form-group" style="margin-top:8px">
        <textarea rows="2" data-action="note" data-id="${appt.id}" placeholder="Add notes...">${appt.note || ""}</textarea>
        <button class="select-btn" data-action="save-note" data-id="${appt.id}">Save note</button>
      </div>
    </li>
  `
    )
    .join("");
}

function handleAppointmentAction(event) {
  const action = event.target.dataset.action;
  const id = event.target.dataset.id;
  if (!action || !id) return;
  const appt = appointments.find((item) => item.id === id);
  if (!appt) return;

  if (action === "status") {
    appt.status = event.target.value;
  } else if (action === "resched") {
    const newTime = prompt("Enter new time (e.g., 4:15 PM):", appt.time);
    if (newTime) {
      appt.time = newTime;
      appt.status = "Confirmed";
    }
  } else if (action === "cancel") {
    appt.status = "Cancelled";
  } else if (action === "save-note") {
    const textarea = todayList.querySelector(`textarea[data-id="${id}"]`);
    if (textarea) appt.note = textarea.value.trim();
  }
  renderAppointments();
}

function renderPayments() {
  paymentsTable.innerHTML = `
    <tr>
      <th>Client</th>
      <th>Service</th>
      <th>Amount</th>
      <th>Status</th>
      <th>Date</th>
    </tr>
    ${payments
      .map(
        (pmt) => `
        <tr>
          <td class="label-strong">${pmt.client}</td>
          <td>${pmt.service}</td>
          <td class="label-strong">${pmt.amount}</td>
          <td>
            <span class="pill ${pmt.status === "Paid" ? "pill-green" : "pill-amber"}">${pmt.status}</span>
          </td>
          <td>${pmt.date}</td>
        </tr>
      `
      )
      .join("")}
  `;
}

function renderServices() {
  servicesList.innerHTML = services
    .map(
      (svc) => `
    <li class="list-item">
      <div class="flex-between">
        <div>
          <div class="label-strong">${svc.name}</div>
          <div class="muted">${svc.duration} • ${svc.type}</div>
        </div>
        <div class="label-strong">${svc.price}</div>
      </div>
      <div class="flex-between">
        <span class="pill ${svc.active ? "pill-green" : "pill-amber"}">${svc.active ? "Enabled" : "Disabled"}</span>
        <div style="display:flex; gap:8px">
          <button class="select-btn" data-service="${svc.id}" data-action="toggle">${svc.active ? "Disable" : "Enable"}</button>
          <button class="select-btn" data-service="${svc.id}" data-action="edit">Edit</button>
          <button class="select-btn" data-service="${svc.id}" data-action="delete">Delete</button>
        </div>
      </div>
      <div class="muted">${svc.description || ""}</div>
    </li>
  `
    )
    .join("");
}

function resetServiceForm() {
  editingServiceId = null;
  serviceIdInput.value = "";
  serviceNameInput.value = "";
  servicePriceInput.value = "";
  serviceDurationInput.value = "";
  serviceCategoryInput.value = "";
  serviceDescriptionInput.value = "";
  serviceSubmit.textContent = "Add Service";
}

function upsertService(event) {
  event.preventDefault();
  const name = serviceNameInput.value.trim();
  const priceValue = servicePriceInput.value.trim();
  const durationValue = serviceDurationInput.value.trim();
  const category = serviceCategoryInput.value.trim();
  const description = serviceDescriptionInput.value.trim();
  if (!name || !priceValue || !durationValue || !category || !description) return;

  const price = `$${Number(priceValue)}`;
  const duration = `${Number(durationValue)} min`;

  if (editingServiceId) {
    const svc = services.find((s) => s.id === editingServiceId);
    if (svc) {
      svc.name = name;
      svc.price = price;
      svc.duration = duration;
      svc.type = category;
      svc.description = description;
    }
  } else {
    services.unshift({
      id: `${name.toLowerCase().replace(/\\s+/g, "-")}-${Date.now()}`,
      name,
      price,
      duration,
      type: category,
      description,
      active: true,
    });
  }

  resetServiceForm();
  renderServices();
}

function handleServiceAction(event) {
  const button = event.target.closest("[data-service]");
  if (!button) return;
  const id = button.dataset.service;
  const action = button.dataset.action;
  const index = services.findIndex((s) => s.id === id);
  if (index === -1) return;
  const svc = services[index];

  if (action === "toggle") {
    svc.active = !svc.active;
  } else if (action === "edit") {
    editingServiceId = svc.id;
    serviceIdInput.value = svc.id;
    serviceNameInput.value = svc.name;
    servicePriceInput.value = Number(svc.price.replace(/[^0-9.]/g, "")) || "";
    serviceDurationInput.value = Number(svc.duration.replace(/[^0-9]/g, "")) || "";
    serviceCategoryInput.value = svc.type || "";
    serviceDescriptionInput.value = svc.description || "";
    serviceSubmit.textContent = "Update Service";
  } else if (action === "delete") {
    services.splice(index, 1);
  }
  renderServices();
}

function renderClients() {
  const query = clientSearch.value.toLowerCase();
  const filter = clientFilter.value;
  const filtered = clients.filter((client) => {
    const matchesQuery = client.name.toLowerCase().includes(query) || client.email.toLowerCase().includes(query);
    const matchesFilter = filter === "all" ? true : client.status === filter;
    return matchesQuery && matchesFilter;
  });

  clientsTable.innerHTML = `
    <tr>
      <th>Client</th>
      <th>Email</th>
      <th>Lifetime Value</th>
      <th>Status</th>
      <th>Actions</th>
    </tr>
    ${filtered
      .map(
        (client) => `
        <tr data-client="${client.email}">
          <td class="label-strong">${client.name}</td>
          <td>${client.email}</td>
          <td class="label-strong">${client.total}</td>
          <td><span class="pill ${client.status === "vip" ? "pill-blue" : "pill-green"}">${client.status.toUpperCase()}</span></td>
          <td>
            <div style="display:flex; gap:8px">
              <button class="select-btn" data-client="${client.email}" data-action="edit-client">Edit</button>
              <button class="select-btn" data-client="${client.email}" data-action="status-client">Status</button>
              <button class="select-btn" data-client="${client.email}" data-action="value-client">Update $</button>
            </div>
          </td>
        </tr>
      `
      )
      .join("")}
  `;
}

function handleClientAction(event) {
  const action = event.target.dataset.action;
  const email = event.target.dataset.client;
  if (!action || !email) return;
  const client = clients.find((c) => c.email === email);
  if (!client) return;

  if (action === "edit-client") {
    const name = prompt("Update client name:", client.name) || client.name;
    const newEmail = prompt("Update client email:", client.email) || client.email;
    client.name = name.trim() || client.name;
    client.email = newEmail.trim() || client.email;
  } else if (action === "status-client") {
    const status = prompt('Status (vip / active):', client.status) || client.status;
    client.status = status.toLowerCase() === "vip" ? "vip" : "active";
  } else if (action === "value-client") {
    const value = prompt("Update lifetime value (number only):", client.total.replace(/[^0-9.]/g, "")) || client.total;
    const clean = Number(value);
    if (!Number.isNaN(clean)) client.total = `$${clean}`;
  }
  renderClients();
}

servicesList.addEventListener("click", (event) => {
  handleServiceAction(event);
});

todayList.addEventListener("change", handleAppointmentAction);
todayList.addEventListener("click", (event) => {
  if (event.target.dataset.action === "resched" || event.target.dataset.action === "cancel" || event.target.dataset.action === "save-note") {
    handleAppointmentAction(event);
  }
});

clientSearch.addEventListener("input", renderClients);
clientFilter.addEventListener("change", renderClients);
clientsTable.addEventListener("click", (event) => {
  if (event.target.dataset.action && event.target.dataset.client) {
    handleClientAction(event);
  }
});
serviceForm.addEventListener("submit", upsertService);
serviceCancel.addEventListener("click", (event) => {
  event.preventDefault();
  resetServiceForm();
});

renderStats();
renderAppointments();
renderPayments();
renderServices();
renderClients();
