import os
import pandas as pd
import sounddevice as sd
import numpy as np
import wave
import tkinter as tk
from tkinter import ttk, messagebox
import threading
from datetime import datetime 

# Import the new, unified SDK
from google.genai.client import Client

# === Step 0: Global Configuration and Initialization ===
api_key = os.environ.get("GOOGLE_API_KEY")
if not api_key:
    # Set a placeholder or error out later in the GUI
    pass 

recording_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S") # <-- CAPTURE RECORDING DATE/TIME
print(f"Recording date/time captured: {recording_date}")

# Initialize Gemini Client
try:
    client = Client(api_key=api_key)
    CHEAPEST_MODEL = "gemini-2.5-flash-lite"
    API_STATUS = "Ready"
except Exception:
    API_STATUS = "API Key Error or Client Init Failure"
    
# === Step 1: Core Functionalities ===
def record_audio(filename, duration, samplerate=16000):
    """
    Records audio from the microphone and saves it as a WAV file.
    """
    print(f"Recording for {duration} seconds...")
    audio = sd.rec(int(duration * samplerate), samplerate=samplerate, channels=1, dtype='float32')
    sd.wait()

    audio_int16 = np.int16(audio * 32767)
    with wave.open(filename, 'wb') as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(samplerate)
        wf.writeframes(audio_int16.tobytes())
    return True

def transcribe_audio(audio_path, client, model_name, ui_instance):
    """ Transcribe audio using the Gemini API. """
    ui_instance.update_status("Uploading and Transcribing Audio...")
    
    audio_file = None
    try:
        # 1. Upload the file
        audio_file = client.files.upload(file=audio_path)
        
        # 2. Generate content
        prompt = "Transcribe this audio to text."
        response = client.models.generate_content(
            model=model_name,
            contents=[audio_file, prompt]
        )
        return response.text
    finally:
        # 3. Clean up the uploaded file
        if audio_file:
            client.files.delete(name=audio_file.name)
            ui_instance.update_status(f"Uploaded file {audio_file.name} deleted.")

def summarize_transcript(text, model_name, ui_instance):
    """ Summarize transcript via Gemini API. """
    ui_instance.update_status("Generating Medical Summary...")
    response = client.models.generate_content(
        model=model_name,
        contents=[f"Print todays date {recording_date}. Summarize this long transcript concisely for a doctor, focusing on symptoms, medication changes, and follow-up plans, and format the output as a clean markdown block with headings and bullet points:\n\n---\n\n{text}"]
    )
    return response.text

def export_markdown_box(text, md_path):
    """ Saves the text to a .md file. """
    with open(md_path, 'w', encoding='utf-8') as f:
        f.write(text)

# === GUI Application Class ===
class MedicalSummarizerApp:
    def __init__(self, master):
        self.master = master
        master.title("Gemini Medical Summarizer")

        # --- Variables ---
        self.duration_var = tk.DoubleVar(value=30.0)
        self.filename_var = tk.StringVar(value="patient_consultation")
        self.status_var = tk.StringVar(value=f"API Status: {API_STATUS}")
        
        # --- GUI Elements ---
        
        # 1. File Name Input
        ttk.Label(master, text="Output File Name:").grid(row=0, column=0, padx=10, pady=5, sticky="w")
        self.filename_entry = ttk.Entry(master, textvariable=self.filename_var, width=30)
        self.filename_entry.grid(row=0, column=1, padx=10, pady=5, sticky="ew")

        # 2. Duration Slider
        ttk.Label(master, text="Recording Duration (s):").grid(row=1, column=0, padx=10, pady=5, sticky="w")
        self.duration_slider = ttk.Scale(
            master,
            from_=10, to=120,
            orient="horizontal",
            variable=self.duration_var,
            command=self.update_duration_label
        )
        self.duration_slider.grid(row=1, column=1, padx=10, pady=5, sticky="ew")

        # 3. Duration Label
        self.duration_label = ttk.Label(master, text=f"{self.duration_var.get():.0f} seconds")
        self.duration_label.grid(row=2, column=1, padx=10, pady=5, sticky="w")
        
        # 4. Record/Process Button
        self.process_button = ttk.Button(master, text="Start Recording and Summarize", command=self.start_process_thread)
        self.process_button.grid(row=3, column=0, columnspan=2, padx=10, pady=20, sticky="ew")

        # 5. Status Label
        self.status_label = ttk.Label(master, textvariable=self.status_var, relief=tk.SUNKEN)
        self.status_label.grid(row=4, column=0, columnspan=2, padx=10, pady=5, sticky="ew")

        # 6. Summary Text Box (for display)
        ttk.Label(master, text="Final Summary:").grid(row=5, column=0, padx=10, pady=5, sticky="w")
        self.summary_text = tk.Text(master, height=10, width=60, wrap=tk.WORD)
        self.summary_text.grid(row=6, column=0, columnspan=2, padx=10, pady=10, sticky="nsew")
        
        # Configure grid weight so elements expand correctly
        master.grid_columnconfigure(1, weight=1)
        master.grid_rowconfigure(6, weight=1)
        
        if API_STATUS != "Ready":
             self.status_var.set(f"ERROR: {API_STATUS}. Please set GOOGLE_API_KEY.")
             self.process_button.config(state=tk.DISABLED)

    def update_duration_label(self, event):
        """ Update the label text when the slider moves. """
        self.duration_label.config(text=f"{self.duration_var.get():.0f} seconds")

    def update_status(self, message):
        """ Update the status message in the GUI. """
        self.status_var.set(f"Status: {message}")
        self.master.update_idletasks()
    
    def start_process_thread(self):
        """ Start the main process in a separate thread to keep the GUI responsive. """
        self.process_button.config(state=tk.DISABLED)
        self.summary_text.delete('1.0', tk.END)
        self.update_status("Starting background process...")
        
        # Run the lengthy process in a thread
        threading.Thread(target=self.run_full_process).start()

    def run_full_process(self):
        """ Contains the full record -> transcribe -> summarize pipeline. """
        audio_file = f"{self.filename_var.get()}_consultation.wav"
        markdown_file = f"{self.filename_var.get()}_summary.md"
        duration = int(self.duration_var.get())
        
        try:
            self.update_status(f"1/4: Recording {duration} seconds...")
            # 1. Record
            record_audio(audio_file, duration=duration)

            # 2. Transcribe
            transcript = transcribe_audio(audio_file, client, CHEAPEST_MODEL, self)
            
            # 3. Summarize
            summary = summarize_transcript(transcript, CHEAPEST_MODEL, self)
            
            # 4. Export Summary
            export_markdown_box(summary, markdown_file)
            
            # 5. Update GUI
            self.summary_text.insert(tk.END, summary)
            self.update_status(f"✅ Success! Summary saved to {markdown_file}")

        except Exception as e:
            error_message = f"Process Failed: {e}"
            self.update_status(error_message)
            messagebox.showerror("Error", error_message)
            
        finally:
            # Clean up local files and re-enable button
            if os.path.exists(audio_file):
                os.remove(audio_file)
            self.process_button.config(state=tk.NORMAL)
            print(f"Clean up complete. Removed local file: {audio_file}")


# === Main Execution ===
if __name__ == "__main__":
    root = tk.Tk()
    app = MedicalSummarizerApp(root)
    root.mainloop()