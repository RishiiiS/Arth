import os
import google.generativeai as genai
from dotenv import load_dotenv

# Dynamically resolve root-level .env location from this nested Python module
env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".env"))
load_dotenv(dotenv_path=env_path)

# ==========================================
# ARCHITECTURE MODE SWITCH
# Modularity design enforcing zero vendor-lock:
# Switch to "local" to bypass Gemini and instead invoke a local HuggingFace inference pipe later.
# ==========================================
MODE = "gemini"  # "gemini" | "local"

if MODE == "gemini":
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable is not set. Please add it to the .env file.")
    genai.configure(api_key=api_key)

def summarize_with_gemini(text: str, is_final: bool = False) -> str:
    """
    Invokes the Google Gemini model. Uses explicit structured prompting based on context.
    """
    # Utilizing gemini-2.5-pro for advanced logic mapping and reliable context retention
    model = genai.GenerativeModel('gemini-2.5-pro') 
    
    if is_final:
        prompt = f"Combine and summarize the following points into a concise overall summary:\n\n{text}"
    else:
        prompt = f"Summarize the following transcript chunk in clear bullet points with key ideas:\n\n{text}"

    # Defensive generation against potential API timeouts or blocking filters
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        raise Exception(f"Gemini API failure: {str(e)}")

def summarize_with_local(text: str, is_final: bool = False) -> str:
    """
    Placeholder inference interface allocated for an open-source Hugging Face model integration.
    """
    return "[Local Inference Logic Not Yet Implemented]"

def summarize_chunks(chunks: list) -> list:
    """
    Ingests segmented textual chunks linearly. 
    Routes context safely via the Switch mechanism for summarization.
    """
    chunk_summaries = []
    
    for chunk in chunks:
        # Ignore extremely short strings containing no semantic value (noise text)
        if not chunk or len(chunk.split()) < 10:
            continue
            
        if MODE == "gemini":
            summary = summarize_with_gemini(chunk, is_final=False)
        elif MODE == "local":
            summary = summarize_with_local(chunk, is_final=False)
        else:
            raise ValueError(f"CRITICAL FAULT - Unknown Model Architecture MODE toggled: {MODE}")
            
        chunk_summaries.append(summary)
        
    return chunk_summaries

def generate_final_summary(chunk_summaries: list) -> str:
    """
    Ingests an aggregated list of individual chunk summaries, rendering them into a hierarchical, cohesive final block.
    """
    if not chunk_summaries:
        return "Insufficient valid transcription data to summarize."
        
    # Aggregate separated chunks with adequate spacing
    combined_text = "\n\n".join(chunk_summaries)
    
    if MODE == "gemini":
        return summarize_with_gemini(combined_text, is_final=True)
    elif MODE == "local":
        return summarize_with_local(combined_text, is_final=True)
    else:
        raise ValueError(f"CRITICAL FAULT - Unknown Model Architecture MODE toggled: {MODE}")
