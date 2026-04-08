import sys
import json
from audio import download_audio
from whisper_model import transcribe_audio
from preprocess import clean_text, split_into_chunks
from summarizer import summarize_chunks, generate_final_summary

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
        
        # 3. Clean the raw text blob (stripping linguistic filler)
        raw_text = transcription_result["text"]
        cleaned_text = clean_text(raw_text)
        
        # 4. Syntactically chunk the output to respect LLM Token window limits
        chunks = split_into_chunks(cleaned_text, max_words=200)

        # 5. Summarize algorithmically into Chunk-Level and Final Master-Level outputs
        chunk_summaries = summarize_chunks(chunks)
        final_summary = generate_final_summary(chunk_summaries)

        # 6. Emit solely valid JSON to stdout
        print(json.dumps({
            "status": "success",
            "final_summary": final_summary,
            "chunk_summaries": chunk_summaries,
            "language": transcription_result["language"],
            "audio_path": audio_path
        }))
        
    except Exception as e:
        # Graceful unified crash handling enforcing unbreakable strict JSON return syntax
        print(json.dumps({
            "status": "error",
            "message": str(e)
        }))
        sys.exit(1)

if __name__ == "__main__":
    main()
