import sys
import json
from audio import download_audio

def main():
    if len(sys.argv) < 2:
        print(json.dumps({
            "status": "error", 
            "message": "Missing YouTube URL argument"
        }))
        sys.exit(1)
        
    url = sys.argv[1]
    
    try:
        audio_path = download_audio(url)
        # Ensure ONLY JSON is printed to stdout for Node.js parsing
        print(json.dumps({
            "status": "success",
            "audio_path": audio_path
        }))
    except Exception as e:
        print(json.dumps({
            "status": "error",
            "message": str(e)
        }))
        sys.exit(1)

if __name__ == "__main__":
    main()
