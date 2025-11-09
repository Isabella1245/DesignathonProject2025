# Gemini Medical Summarizer 

**Description:** 
This desktop application records audio, transcribes it via the Google Gemini API, and generates a concise medical summary in markdown format. 
It is designed as proof of concept to be used in a webservice that allows healthcare providers to converse through clinic summaries rather than cumbersome transcriptions.\

**Important Notes:** 
- **API Key:** You must provide your own Google API key via the `GOOGLE_API_KEY` environment variable. The key is **not included** in this repository.
- **Data Privacy:** This app is **not HIPAA-compliant**. Do **not** use it with real patient data. Only test with simulated or non-sensitive audio.
- **Time Limit** Current time limit is set to 120 seconds. Increase as necessary ---

## Dependencies Install the required Python packages using pip: 
```bash pip install numpy pandas sounddevice google-genai
