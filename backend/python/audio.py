import os
import yt_dlp

class QuietLogger:
    def debug(self, msg):
        pass
    def warning(self, msg):
        pass
    def error(self, msg):
        pass

def download_audio(url: str) -> str:
    """
    Downloads audio from a YouTube URL and converts it to mp3.
    Returns the absolute path to the downloaded audio.mp3 file.
    """
    # Calculate path based on current file location: ../../../data (since root is two levels up)
    current_dir = os.path.dirname(os.path.abspath(__file__))
    # from python/ go to backend/ then go to root/ then data/
    data_dir = os.path.abspath(os.path.join(current_dir, "..", "..", "data"))
    os.makedirs(data_dir, exist_ok=True)
    
    final_path = os.path.join(data_dir, "audio.mp3")
    
    # Remove existing file if it exists so we always have the latest
    if os.path.exists(final_path):
        os.remove(final_path)

    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': os.path.join(data_dir, 'audio.%(ext)s'),
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
        'quiet': True,               # Prevent console logs
        'no_warnings': True,         # Prevent warnings
        'logger': QuietLogger(),     # Custom logger to completely mute output
    }
    
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])
        
    return final_path
