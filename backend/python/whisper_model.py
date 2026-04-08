import os
import sys
import whisper
import warnings
import ssl

# Bypass SSL verification for macOS environments
ssl._create_default_https_context = ssl._create_unverified_context

# Suppress FP16 CPU warning printed by Whisper
warnings.filterwarnings("ignore")

class SuppressOutput:
    """
    Context manager to safely and completely swallow stdout and stderr.
    This guarantees no internal library progress bars or C-level print streams
    leak out and ruin the JSON format for Node.js parsing.
    """
    def __enter__(self):
        self._sys_stdout = sys.stdout
        self._sys_stderr = sys.stderr
        sys.stdout = open(os.devnull, 'w')
        sys.stderr = open(os.devnull, 'w')

    def __exit__(self, exc_type, exc_val, exc_tb):
        sys.stdout.close()
        sys.stdout = self._sys_stdout
        sys.stderr.close()
        sys.stderr = self._sys_stderr

# Global model instance to ensure it's loaded only once during the lifetime of this process script
_model = None

def get_model():
    """Singleton getter for the Whisper model to avoid repeated loading overhead."""
    global _model
    if _model is None:
        # We wrap model loading to swallow PyTorch or tqdm loading bars
        with SuppressOutput():
            _model = whisper.load_model("base")
    return _model

def transcribe_audio(audio_path: str) -> dict:
    """
    Takes an audio file path, runs Whisper transcription, and formats output.
    Returns a structured dictionary ready to be dumped as JSON.
    """
    model = get_model()
    
    # Run transcription
    # We wrap the transcribe method to aggressively silence any "Detected language" prints 
    # or progress bars that bypass the verbose=False flag.
    with SuppressOutput():
        result = model.transcribe(audio_path, verbose=False)
    
    # Filter only the required details
    segments = [
        {
            "start": round(seg["start"], 2),
            "end": round(seg["end"], 2),
            "text": seg["text"].strip()
        } for seg in result.get("segments", [])
    ]
    
    return {
        "text": result.get("text", "").strip(),
        "segments": segments,
        "language": result.get("language", "unknown")
    }
