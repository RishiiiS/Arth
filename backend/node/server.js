const express = require('express');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
app.use(express.json());

app.post('/process', (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ 
            status: 'error', 
            message: 'YouTube URL is required in JSON body' 
        });
    }

    // Use venv python explicitly if it exists, fallback to python3
    const venvPythonPath = path.join(__dirname, '..', 'python', 'venv', 'bin', 'python3');
    const fs = require('fs');
    const pythonExecutable = fs.existsSync(venvPythonPath) ? venvPythonPath : 'python3'; 
    const pythonScriptPath = path.join(__dirname, '..', 'python', 'main.py');
    
    // Spawn Python process
    const pythonProcess = spawn(pythonExecutable, [pythonScriptPath, url]);

    let rawData = '';
    let errorData = '';

    // Capture standard output
    pythonProcess.stdout.on('data', (data) => {
        rawData += data.toString();
    });

    // Capture standard error
    pythonProcess.stderr.on('data', (data) => {
        errorData += data.toString();
    });

    // Handle process completion
    pythonProcess.on('close', (code) => {
        try {
            // Trim whitespace to ensure clean JSON parsing
            const trimmedData = rawData.trim();
            const result = JSON.parse(trimmedData);
            
            if (code !== 0 || result.status === 'error') {
                return res.status(500).json({
                    status: 'error',
                    message: result.message || 'Python process failed',
                    stderr: errorData
                });
            }

            return res.json(result);
            
        } catch (e) {
            return res.status(500).json({
                status: 'error',
                message: 'Failed to parse JSON output from Python script',
                rawOutput: rawData,
                stderr: errorData
            });
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:3000/`);
});
