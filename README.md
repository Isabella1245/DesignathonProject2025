### Team Members
Katya Tipps  
Evan Mullins  
Isabella Bodea  
Rhyan Parrish

---

### Statement of Intent
Whether due to changes in location or unexpected complications concerning multiple specialties, patients often move between primary care providers. This process of remembering, repeating, and coordinating medical history between providers leads to fragmented care, wasted time, and emotional fatigue.

For providers, a great deal of patient information is lost in this “telephone” game from provider to patient to provider, often roughly piecing together the patient's medical history through word of mouth and cumbersome medical transcriptions. These conversations are further challenged by providers splitting time between transcribing information and engaging with the patient. Ultimately, this divided experience results in patients leaving their provider’s office feeling disconnected, frustrated, and unfulfilled — contributing to roughly 30% of patients switching providers.

---

### Target Users
- Healthcare Professionals  
- Patients needing repetitive or multi-provider care (elderly, chronic illnesses, complex medical histories)

---

### Solution: **Medlog** (AI-Powered Clinical Summarization Portal)
Medlog is a web-based service that accumulates medical information across providers and visits to generate a clear and structured timeline of a patient’s care. Providers can record, transcribe, and summarize clinical conversations directly into the patient’s record, improving continuity and shared understanding across multiple care settings.

---

### Technology Used
- **Frontend:** JavaScript, HTML, CSS  
- **Speech-to-Text:** Python-based recorder  
- **LLM Summarization:** Gemini API (temporary implementation)

---

### How Medlog Runs
Medlog’s home screen features secure two-factor authentication and allows users to identify whether they are a patient or provider.

- **Patients** can create profiles, receive provider invitations, and view visit summaries structured in an accessible, chronological format.  
- **Providers** can invite patients or view a patient’s clinical timeline summarizing their recorded medical history.

The transcription pipeline currently runs locally. Python captures the audio and sends it to a secure Gemini summarization process that extracts clinically relevant terminology. After summarization, the `.wav` audio file is deleted to reduce data exposure risks.

---

### Business Model
Medlog is designed for seamless integration into existing healthcare environments. Early-stage deployment would occur in small clinics with patients willing to participate in trial usage.

Over time, Medlog could be adopted by major healthcare ecosystems such as Epic (MyChart). Large-scale integration would offer users increased continuity of care and improved clinical documentation workflows. While integrating into a major system may reduce standalone flexibility, Medlog would benefit significantly from leveraging existing secure data infrastructures. Medlog is designed to operate at *zero economic profit*, with sustainability supported by institutional integration and shared infrastructure rather than commercial markup.

---

### HIPAA Compliance and Data Security
To be production-ready, Medlog must meet HIPAA standards regarding identity protection, data handling, and clinical information privacy. Required measures include:

1. Strong multi-factor authentication for all users  
2. Automatic session timeout and identity management protocols  
3. Audit logs documenting all access to patient data  
4. Local or HIPAA-compliant cloud processing of transcription and summarization  
5. Deployment of a secure LLM environment, ideally in-house or within hospital research infrastructure (e.g., UF Health’s GatorTron demonstrates feasibility)  
6. Cloud storage under a Business Associate Agreement (BAA) with a HIPAA-compliant provider, such as AWS or Azure  

---

### Future Development Roadmap
Due to time and resource constraints during the hackathon, several features are planned for future development:

- Ability to automatically save summaries to the patient’s timeline (after HIPAA-compliant backend completion)
- Provider–patient account linking and invitation system
- Provider view of all clinicians currently involved in a patient’s care
- Patient-side view of their full medical timeline and history
- Timeline view as the default provider interface, with optional full-record expansion
- Secure messaging between providers regarding shared patients
- Construction of a robust backend/API to support scalability and encryption
- Development of an in-house or hospital-hosted summarization model to eliminate third-party data handling
- Secure encrypted cloud data storage and server hosting

---
