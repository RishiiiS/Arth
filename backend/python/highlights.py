import math

def format_time(seconds: float) -> str:
    """
    Converts raw floating point seconds (e.g. 75.3) into standard chronological 
    video timestamp format (e.g. "01:15").
    """
    parsed = int(math.floor(seconds))
    minutes = parsed // 60
    secs = parsed % 60
    return f"{minutes:02d}:{secs:02d}"

def extract_highlights(segments: list, top_n: int = 5) -> list:
    """
    Heuristically extracts key transcript phrases to generate timeline highlights.
    Avoids heavy ML models by mapping structural keyword frequency to filter noise.
    """
    if not segments:
        return []

    # Dictionary of words highly correlated with instructional/essay structural shifts
    important_keywords = {
        "important", "key", "main", "concept", "crucial", "summary", 
        "basically", "remember", "secret", "conclusion", "focus",
        "first", "finally", "therefore", "significant"
    }

    scored_segments = []

    for seg in segments:
        text = seg.get("text", "").strip()
        if not text:
            continue
            
        words = text.lower().split()
        word_count = len(words)
        
        # Guard barrier: Penalize exceedingly short (noise) or unwieldy run-on segments 
        # which aren't readable as standalone highlights
        if word_count < 5 or word_count > 30:
            score = 0
        else:
            # Baseline valid syntax score
            score = 1
            
            # Aggregate structural weight multipliers
            keyword_matches = sum(1 for w in words if w.strip(',.!?') in important_keywords)
            score += (keyword_matches * 3)  # Heavy weighting for keyword presence

        scored_segments.append({
            "time": format_time(seg["start"]),
            "text": text,
            "score": score,
            "raw_start": seg["start"] # Preserved for chronological sorting
        })

    # Sort strictly by heuristic score (descending)
    scored_segments.sort(key=lambda x: x["score"], reverse=True)
    
    # Cull to the Top N elements
    top_segments = scored_segments[:top_n]
    
    # Scrub out instances where zero valid highlights exist 
    top_segments = [s for s in top_segments if s["score"] > 0]
    
    # Master Re-sort: Enforce chronological timeline order so the UX makes linear sense safely
    top_segments.sort(key=lambda x: x["raw_start"])

    # Output strict JSON formatting
    highlights = [
        {"time": s["time"], "text": s["text"]} 
        for s in top_segments
    ]

    return highlights
