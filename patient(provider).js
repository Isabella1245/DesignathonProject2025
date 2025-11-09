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
        defaultTimeline: [{
            date: "2025-11-05",
            title: "Consultation with Katya: Potential Kidney Stones",
            desc: "Pain: Intense, intermittent lower back and flank pain.<br>Pain radiates towards the lower abdomen.<br>Pain is severe enough to cause discomfort in all positions, including during sleep.<br>Dysuria (painful urination).<br>Dark, reddish urine.\nIntermittent nausea.<br>Patient reports feeling generally unwell.<br>Patient suspects kidney stones.<br>No other reported medical history and no current medications."
        },
        {
            date: "2025-11-10",
            title: "Consultation with Katya: Robotics Accident",
            desc: "SPatient reports complete loss of sensation in both legs.<br>Patient states a robot ran over their legs while they were programming it. They were standing, and the robot hit their legs, causing them to collapse.<br>Patient is currently using a wheelchair and requires assistance for mobility.<br>Patient denies any pain in their legs at this time.<br>Patient indicates the robot's disable button was not functioning.<br>No new medications prescribed or changes made during this interaction.<br>Due to the significant neurological deficit (loss of leg sensation) and the mechanism of injury, urgent assessment by a medical professional is necessary to determine the cause and extent of the injury."
        },
        {
            date: "2023-11-12",
            title: "Consultation with Katya: Follow up on accident, possible developing schitzophrenia",
            desc: "Auditory hallucinations: Hearing voices that are not identifiable.<br>Visual hallucinations: Seeing vague figures of people who are not present.<br>Racing thoughts and impaired focus.<br>Difficulty with processing and connecting thoughts.<br>Suspiciousness towards others.<br>Difficulty trusting and communicating.<br>Feeling confused, stressed, and not like their usual self.<br>No medication changes reported.<br>Further evaluation is recommended to investigate into potential causes for hallucinations and paranoid ideation."
            
        }]
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
        defaultTimeline: ["mockPatientData/patient_consultation_katya_summary.md"]
        
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

// --- Determine which patient to load ---
const params = new URLSearchParams(window.location.search);
let id = params.get('id');

// ✅ Default to Katya (id = 1) if no ?id provided
if (!id) {
  console.warn("No patient ID found in URL — defaulting to Katya (id=1)");
  id = 1;
}

const patient = patients.find(p => p.id == id);

// If no patient found at all, show fallback message
if (!patient) {
  document.getElementById("profileContainer").innerHTML = `
    <p style="text-align:center; color:#666;">No patient data found.</p>
  `;
  throw new Error("No valid patient found — check your ID or data structure.");
}

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

  // Assign events for timeline
  events = (patient.id === 1 && patient.defaultTimeline) 
      ? patient.defaultTimeline.slice()  // use Katya's defaultTimeline array of objects
      : [];  // empty for other patients (or you can handle them later)
  renderTimeline();


}