import re

def clean_text(text: str) -> str:
    """
    Cleans transcript text by aggressively removing common English and Hindi filler words,
    and normalizing chaotic spacing/newlines into standard single spaces.
    Handles empty or remarkably short texts natively.
    """
    if not text or not text.strip():
        return ""

    # Case-insensitive extraction of filler words (bounded by word boundaries \b)
    # This prevents accidentally replacing 'toh' inside the word 'autohub'
    fillers = [
        r'\bum\b', r'\buh\b', r'\byou know\b',  # English
        r'\bmatlab\b', r'\btoh\b', r'\bhaan\b'  # Hindi
    ]
    
    # Combine all patterns dynamically
    pattern = '|'.join(fillers)
    
    # Substitute filler words with an empty space
    cleaned = re.sub(pattern, ' ', text, flags=re.IGNORECASE)
    
    # Normalize multiple spaces, tabs, and newlines down to a single space
    cleaned = re.sub(r'\s+', ' ', cleaned)
    
    return cleaned.strip()

def split_into_chunks(text: str, max_words: int = 200) -> list:
    """
    Splits text into chunks of at most `max_words`.
    Optimizes for semantic retention by breaking primarily on standard sentence terminators,
    but possesses fallback logic for unusually long sentences missing punctuation.
    """
    if not text or not text.strip():
        return []

    # Segregate the text into raw sentences by utilizing standard punctuation markers.
    # The '(?<=[.!?])\s+' regex looks for space preceded by a terminator.
    sentences = re.split(r'(?<=[.!?])\s+', text.strip())
    
    chunks = []
    current_chunk = []
    current_word_count = 0
    
    for sentence in sentences:
        if not sentence: continue
        
        words = sentence.split()
        word_count = len(words)
        
        # Edge Case Override: If a single run-on sentence is obscenely long (longer than max_words), 
        # we forcefully slice the sentence in half dynamically to strictly respect max_words bounds, 
        # avoiding context window explosions down the line.
        if word_count > max_words:
            # Flush whatever we currently have in reserve before beginning the mega-slice
            if current_chunk:
                chunks.append(' '.join(current_chunk))
                current_chunk = []
                current_word_count = 0
                
            # Dice the giant sentence up linearly
            for i in range(0, word_count, max_words):
                sliced_words = words[i:i + max_words]
                chunks.append(' '.join(sliced_words))
            continue
            
        # Standard Processing: Aggregate sentences into the buffer until max_words approaches
        if current_word_count + word_count > max_words:
            # Exceeded capacity threshold -> Commit the buffer to chunks
            chunks.append(' '.join(current_chunk))
            
            # Start a brand new buffer populated by the sentence that triggered the threshold
            current_chunk = [sentence]
            current_word_count = word_count
        else:
            # Plentiful capacity remaining -> Aggregate and continue
            current_chunk.append(sentence)
            current_word_count += word_count
            
    # End of string: flush remaining buffer
    if current_chunk:
        chunks.append(' '.join(current_chunk))
        
    return chunks
