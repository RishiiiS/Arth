import sys
import json
from audio import download_audio
from whisper_model import transcribe_audio

def main():
    if len(sys.argv) < 2:
        print(json.dumps({
            "status": "error", 
            "message": "Missing YouTube URL argument"
        }))
        sys.exit(1)
        
    url = sys.argv[1]
    
    try:
        # 1. Download audio via yt-dlp
        audio_path = download_audio(url)
        
        # 2. Transcribe using local Whisper model
        transcription_result = transcribe_audio(audio_path)
        
        # Ensure ONLY JSON is printed to stdout so Node processes it safely
        print(json.dumps({
            "status": "success",
            "audio_path": audio_path,
            "transcript": transcription_result["text"],
            "language": transcription_result["language"],
            "segments": transcription_result["segments"]
        }))
        
    except Exception as e:
        print(json.dumps({
            "status": "error",
            "message": str(e)
        }))
        sys.exit(1)

if __name__ == "__main__":
    main()
