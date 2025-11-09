const sendBtn = document.getElementById("sendBtn");
const input = document.getElementById("messageInput");
const chat = document.querySelector(".chat-messages");

sendBtn.addEventListener("click", () => {
  const text = input.value.trim();
  if (!text) return;

  const msg = document.createElement("div");
  msg.classList.add("message", "from-me");
  msg.innerHTML = `<strong>Dr. Morales:</strong><p>${text}</p><span class="timestamp">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>`;
  
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
  input.value = "";
});

const messageThreads = document.querySelectorAll(".thread");
const selectedMessageDiv = document.getElementById("selectedMessage");

messageThreads.forEach(thread => {
  thread.addEventListener("click", () => {
    const doctor = thread.querySelector("strong").innerText;
    const patient = thread.getAttribute("data-patient");
    const text = thread.querySelector("p:nth-of-type(2)").innerText;

    selectedMessageDiv.innerHTML = `
      <p><strong>${doctor}</strong> (regarding <em>${patient}</em>)</p>
      <p>${text}</p>
    `;
  });
});

function filterMessages(patientName) {
  messageThreads.forEach(thread => {
    if (patientName === "All" || thread.getAttribute("data-patient") === patientName) {
      thread.style.display = "block";
    } else {
      thread.style.display = "none";
    }
  });
}

function sendReply() {
  const reply = document.getElementById("replyBox").value.trim();
  if (!reply) return alert("Please enter a message.");
  const messageBox = document.getElementById("selectedMessage");

  messageBox.innerHTML += `<p style="margin-top:10px;"><strong>You:</strong> ${reply}</p>`;
  document.getElementById("replyBox").value = "";
}