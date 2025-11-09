const addEventBtn = document.getElementById("addEventBtn");
const modal = document.getElementById("modal");
const cancelBtn = document.getElementById("cancelBtn");
const saveEventBtn = document.getElementById("saveEventBtn");
const deleteEventBtn = document.getElementById("deleteEventBtn");

let events = [];
let editingIndex = null;

addEventBtn.addEventListener("click", () => {
    modal.style.display = "flex";
    document.getElementById("modalTitle").textContent = "Add Timeline Event";
    deleteEventBtn.style.display = "none";
    editingIndex = null;
});

cancelBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

saveEventBtn.addEventListener("click", () => {
    const title = document.getElementById("eventTitle").value;
    const date = document.getElementById("eventDate").value;
    const desc = document.getElementById("eventDesc").value;

    if (!title || !date) {
        alert("Please fill in both title and date.");
        return;
    }

    const eventData = { title, date, desc };
    
    if (editingIndex !== null) {
        events[editingIndex] = eventData;
    } else {
        events.push(eventData);
    }

    renderTimeline();
    modal.style.display = "none";
    clearModalInputs();
});

function renderTimeline() {
    const timelineContainer = document.getElementById("timeline");
    timelineContainer.innerHTML = "";

    // Sort events by date
    events.sort((a, b) => new Date(a.date) - new Date(b.date));

    events.forEach((event, index) => {
        const item = document.createElement("div");
        item.classList.add("timeline-item");

        // Use innerHTML and allow <br> in desc
        item.innerHTML = `
            <div class="timeline-date">${event.date}</div>
            <div class="timeline-title">${event.title}</div>
            <div class="timeline-details">${event.desc}</div>
        `;

        item.addEventListener("click", () => editEvent(index));
        timelineContainer.appendChild(item);
    });
}


function editEvent(index) {
    const event = events[index];
    editingIndex = index;
    document.getElementById("eventTitle").value = event.title;
    document.getElementById("eventDate").value = event.date;
    document.getElementById("eventDesc").value = event.desc;
    document.getElementById("modalTitle").textContent = "Edit Event";
    deleteEventBtn.style.display = "inline-block";
    modal.style.display = "flex";
}

deleteEventBtn.addEventListener("click", () => {
    if (editingIndex !== null) {
        events.splice(editingIndex, 1);
        renderTimeline();
        modal.style.display = "none";
        clearModalInputs();
    }
});

function clearModalInputs() {
    document.getElementById("eventTitle").value = "";
    document.getElementById("eventDate").value = "";
    document.getElementById("eventDesc").value = "";
}