const { spawn } = require('child_process');
const path = require('path');

const url = "https://www.youtube.com/watch?v=FcsAteosDqk";
const pythonExecutable = 'python3'; 
const pythonScriptPath = path.join(__dirname, '..', 'python', 'main.py');

console.log('Spawning', pythonExecutable, pythonScriptPath, url);
const pythonProcess = spawn(pythonExecutable, [pythonScriptPath, url]);

let rawData = '';
let errorData = '';

pythonProcess.stdout.on('data', (data) => {
    rawData += data.toString();
});

pythonProcess.stderr.on('data', (data) => {
    errorData += data.toString();
});

pythonProcess.on('close', (code) => {
    console.log('--- rawData ---');
    console.log(rawData);
    console.log('--- errorData ---');
    console.log(errorData);
    console.log('--- code ---', code);
});
