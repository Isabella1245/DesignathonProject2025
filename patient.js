const patients = [
    {
        id: 1,
        name: "Katya",
        age: 21,
        photo: "patient.png",
    },
    {
        id: 2,
        name: "Evan",
        age: 25,
        photo: "patient.png",
        
    },
    {
        id: 3,
        name: "Rhyan",
        age: 30,
        photo: "patient.png",
        
    },
    {
        id: 4,
        name: "Isabella",
        age: 27,
        photo: "patient.png",
        
    },
    {
        id: 5,
        name: "John",
        age: 34,
        photo: "patient.png",
        
    },
    {
        id: 6,
        name: "Matthew",
        age: 67,
        photo: "patient.png",
        
    },
    {
        id: 7,
        name: "Carmen",
        age: 18,
        photo: "patient.png",
        
    },
    {
        id: 8,
        name: "Jamie",
        age: 45,
        photo: "patient.png",
        
    }
];

const params = new URLSearchParams(window.location.search);
const id = params.get('id');
const patient = patients.find(p => p.id == id);


if (patient) {
  const profileContainer = document.getElementById("profileContainer");
  
  profileContainer.innerHTML = `
    <img src="${patient.photo}" class="profile-photo" alt="${patient.name}">
    <h1>${patient.name}</h1>
    <p><strong>Age:</strong> ${patient.age}</p>
  `;

  events = patient.timeline.slice();
  renderTimeline();
}

