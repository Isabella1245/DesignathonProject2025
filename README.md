# Timeline Maker

**Description:**  
A web-based interactive timeline tool that allows users to add, edit, and delete chronological events.  
Each event can include a Markdown-formatted description that is rendered in real-time.

**Features:**  
- Add new events with a title, date, and Markdown description.  
- Click existing events to edit or delete them.  
- Dynamic vertical spacing prevents overlaps for long descriptions.  
- Responsive design: timeline scales to half the screen width and centers on the page.  
- Markdown support!

**Dependencies:**  
- No other installation required; the tool runs in any modern browser.

**Usage:**  
1. Open `timeline.html` in your browser.  
2. Click **Add Event** to create a new timeline event.  
3. Click any existing event to edit or delete.  
4. Markdown entered in the description field will render automatically.

**Notes:**  
- Events are automatically sorted chronologically by date.  
- The timeline dynamically adjusts spacing so events do not overlap.  
- All data is stored in memory—refreshing the page will clear your events.  

# Gemini Medical Summarizer

**Description:**  
This desktop application records audio, transcribes it via the Google Gemini API, and generates a concise medical summary in Markdown format.  
It is designed as a proof-of-concept for a web service that allows healthcare providers to interact via clinic summaries rather than cumbersome transcriptions.

**Important Notes:**  
- **API Key:** You must provide your own Google API key via the `GOOGLE_API_KEY` environment variable. The key is **not included** in this repository.  
- **Data Privacy:** This app is **not HIPAA-compliant**. Do **not** use it with real patient data. Only test with simulated or non-sensitive audio.  
- **Time Limit:** Current recording time limit is set to 120 seconds. Increase as necessary.

## Dependencies

Install the required Python packages using pip:

```bash
pip install numpy pandas sounddevice google-genai ```


