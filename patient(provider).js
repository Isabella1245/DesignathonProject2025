// Load Katya's synced data from localStorage
function getKatyaData() {
    try {
        const katyaData = localStorage.getItem('katya_patient_data');
        if (katyaData) {
            return JSON.parse(katyaData);
        }
    } catch (err) {
        console.warn('Error loading Katya data:', err);
    }
    
    // Default data if not found
    return {
        name: 'Katya',
        dob: '01/01/1990',
        gender: 'Female',
        email: 'katya@patient.com',
        phone: '123-456-7890',
        address: '1234',
        insurance: 'insurance provider',
        pharmacy: '5678',
        primaryClinic: 'clinic',
        profileImage: null
    };
}

const patients = [
    {
        id: 1,
        name: "Katya",
        age: 21,
        photo: "patient.png",
        data: getKatyaData(), // Load synced data
        defaultTimeline: ["mockPatientData/patient_consultation_katya_summary.md"]
    },
    {
        id: 2,
        name: "Evan",
        age: 25,
        photo: "patient.png",
        defaultTimeline: ["mockPatientData/patient_consultation_evan_summary.md"]
    },
    {
        id: 3,
        name: "Rhyan",
        age: 30,
        photo: "patient.png",
        defaultTimeline: ["mockPatientData/patient_consultation_rhyan_summary.md"]
    },
    {
        id: 4,
        name: "Isabella",
        age: 27,
        photo: "patient.png",
        defaultTimeline: ["mockPatientData/patient_consultation_bella_summary.md"]
    },
    {
        id: 5,
        name: "John",
        age: 34,
        photo: "patient.png",
        defaultTimeline: ["mockPatientData/patient_consultation_john_summary.md"]
    },
    {
        id: 6,
        name: "Matthew",
        age: 67,
        photo: "patient.png",
        defaultTimeline: ["mockPatientData/patient_consultation_matthew1_summary.md",
                          "mockPatientData/patient_consultation_matthew2_summary.md",
                          "mockPatientData/patient_consultation_matthew3_summary.md"
        ]
    },
    {
        id: 7,
        name: "Carmen",
        age: 18,
        photo: "patient.png",
        defaultTimeline: ["mockPatientData/patient_consultation_carman_summary.md",
                          "mockPatientData/patient_consultation_carman2_summary.md"
        ]
    },
    {
        id: 8,
        name: "Jamie",
        age: 45,
        photo: "patient.png",
        defaultTimeline: ["mockPatientData/patient_consultation_jamie_summary.md"]
    }
];

const params = new URLSearchParams(window.location.search);
const id = params.get('id');
const patient = patients.find(p => p.id == id);

if (patient) {
  const profileContainer = document.getElementById("profileContainer");
  
  // Use synced data for Katya (id=1)
  if (patient.id == 1 && patient.data) {
    const katyaData = patient.data;
    const photoSrc = katyaData.profileImage || patient.photo;
    
    // Calculate age from DOB if available
    let age = patient.age;
    if (katyaData.dob) {
      const dobParts = katyaData.dob.split('/');
      if (dobParts.length === 3) {
        const birthYear = parseInt(dobParts[2]);
        const currentYear = new Date().getFullYear();
        age = currentYear - birthYear;
      }
    }
    
    profileContainer.innerHTML = `
      <img src="${photoSrc}" class="profile-photo" alt="${katyaData.name}">
      <h1>${katyaData.name}</h1>
      <p><strong>Age:</strong> ${age}</p>
      <p><strong>Date of Birth:</strong> ${katyaData.dob}</p>
      <p><strong>Gender:</strong> ${katyaData.gender}</p>
      
      <h2>Contact Information</h2>
      <p><strong>Email:</strong> ${katyaData.email}</p>
      <p><strong>Phone:</strong> ${katyaData.phone}</p>
      <p><strong>Address:</strong> ${katyaData.address}</p>
      
      <h2>Medical Information</h2>
      <p><strong>Insurance:</strong> ${katyaData.insurance}</p>
      <p><strong>Pharmacy:</strong> ${katyaData.pharmacy}</p>
      <p><strong>Primary Clinic:</strong> ${katyaData.primaryClinic}</p>
    `;
  } else {
    // Default display for other patients
    profileContainer.innerHTML = `
      <img src="${patient.photo}" class="profile-photo" alt="${patient.name}">
      <h1>${patient.name}</h1>
      <p><strong>Age:</strong> ${patient.age}</p>
    `;
  }

  events = patient.timeline ? patient.timeline.slice() : [];
  renderTimeline();
}