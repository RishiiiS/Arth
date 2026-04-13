import React from 'react';
import { Activity, Share, List } from 'lucide-react';
import styles from './DashboardGrid.module.css';

const DashboardGrid = ({ progress = 0, statusMessage = 'Idle', isProcessing = false, results = null, url = '' }) => {

  const displayProgress = isProcessing ? progress : (results ? 100 : 0);
  const displayStatus = isProcessing ? statusMessage : (results ? 'Done' : 'Waiting for input...');

  const extractYTId = (link) => {
    if (!link) return null;
    const match = link.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/);
    return match && match[1] ? match[1] : null;
  };
  const ytId = extractYTId(url);
  const showVideo = ytId && (isProcessing || results);


  return (
    <div className={styles.gridContainer}>
      
      {/* LEFT COLUMN */}
      <div className={styles.leftColumn}>
        
        {/* AI Engine Card */}
        <div className={styles.card}>
          <div className={styles.engineHeader}>
            <div className={styles.iconCircle}>
              <Activity size={18} className={styles.engineIcon} />
            </div>
            <div>
              <span className={styles.engineLabel}>AI ENGINE</span>
              <h3 className={styles.engineTitle}>Distilling Narrative</h3>
            </div>
          </div>
          <div className={styles.progressContainer}>
            <div className={styles.progressTextInfo}>
              <span className={styles.progressStatus}>{displayStatus}</span>
              <span className={styles.progressPercent}>{Math.round(displayProgress)}%</span>
            </div>
            <div className={styles.progressBarBg}>
              <div 
                className={styles.progressBarFill} 
                style={{ 
                  width: `${displayProgress}%`, 
                  transition: 'width 0.5s ease-out' 
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Video Thumbnail Card */}
        <div className={styles.card + ' ' + styles.p0}>
          {showVideo ? (
            <div className={styles.iframeContainer}>
              <iframe 
                width="100%" 
                height="200" 
                src={`https://www.youtube.com/embed/${ytId}`} 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                style={{ display: 'block' }}
              ></iframe>
            </div>
          ) : (
            <div className={styles.videoMockup}>
              <div className={styles.videoTime}>{results ? "Extracted" : "--:--"}</div>
              <div className={styles.videoControls}>
                <div className={styles.playBarBase}>
                  <div className={styles.playBarFill}></div>
                  <div className={styles.playBarHandle}></div>
                  <div className={styles.playBarHandleEnd}></div>
                </div>
              </div>
            </div>
          )}
          <div className={styles.videoInfo}>
            <h4>{results ? "System Upload / Extracted Video" : "Awaiting video processing..."}</h4>
            <p>Uploaded by {results ? "Arth Internal System" : "--"}</p>
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN */}
      <div className={styles.rightColumn}>
        
        {/* Executive Summary Card */}
        <div className={styles.card}>
          <div className={styles.summaryHeader}>
            <span className={styles.sectionLabel}>EXECUTIVE SUMMARY</span>
            <button className={styles.iconBtn}>
              <Share size={18} />
            </button>
          </div>
          <h2 className={styles.summaryTitle}>
            {results ? "Generated Insight Overview" : "Navigating the Era of Automated Creativity"}
          </h2>
          <div className={styles.summaryText}>
            {results ? (
              // Splitting summary by double newlines or single newlines
              results.final_summary.split('\n').filter(p => p.trim() !== '').map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))
            ) : (
              <>
                <p>
                  This space will contain the executive summary once a video is processed. The model will algorithmically analyze the chunked transcripts and output the final master-level insights right here.
                </p>
                <p>
                  Paste a YouTube URL above and click "Summarize" to see Semantic processing in action.
                </p>
              </>
            )}
          </div>
        </div>

        {/* Key Highlights Card */}
        <div className={`${styles.card} ${styles.highlightsCard}`}>
          <div className={styles.highlightsHeader}>
            <List size={20} className={styles.listIcon} />
            <h3>Key Highlights</h3>
          </div>
          
          <div className={styles.highlightsList}>
            {results && results.highlights && results.highlights.length > 0 ? (
              results.highlights.map((highlight, idx) => (
                <div className={styles.highlightItem} key={idx}>
                  <div className={styles.timestamp}>{highlight.time}</div>
                  <div className={styles.highlightContent}>
                    {/* The backend only provides 'text', no 'headline'. We'll render text as description or extract a fake headline */}
                    <p style={{ marginTop: 0, fontWeight: 500, color: 'var(--text-main)' }}>
                      {highlight.text}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.highlightItem}>
                <div className={styles.timestamp}>00:00</div>
                <div className={styles.highlightContent}>
                  <h4>Awaiting Transcripts...</h4>
                  <p>Highlights will automatically appear here mapped chronologically once the video is fully distilled.</p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default DashboardGrid;
