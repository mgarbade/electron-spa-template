const { spawn } = require('child_process');
const { dialog } = require('electron');
const path = require('path');

let currentProcess = null;
let isOperationRunning = false;

function checkDocker() {
    try {
        // This will fail if Docker engine is not running
        const result = spawn('docker', ['ps']);
        return true;
    } catch {
        return false;
    }
}

function startContainers(mainWindow) {
    if (currentProcess) {
        currentProcess.kill();
    }
    
    isOperationRunning = true;
    console.log('Starting containers...');
    setTimeout(() => {
        mainWindow.webContents.send('docker-log', 'starting');
    }, 1);    

    currentProcess = spawn('bash', ['-c', `
        echo "Creating network app_default..."
        sleep 2
        echo "Building web service..."
        sleep 2
        echo "Starting containers..."
        sleep 2
        echo "All containers are up and running!"
    `]);

    currentProcess.stdout.on('data', (data) => {
        mainWindow.webContents.send('docker-log', data.toString());
    });

    currentProcess.on('close', (code) => {
        if (code === 0) {
            mainWindow.webContents.send('containers-started');
        }
        isOperationRunning = false;
        currentProcess = null;
    });
}

function stopContainers(mainWindow) {
    if (currentProcess) {
        currentProcess.kill();
    }

    isOperationRunning = true;
    console.log('Stopping containers...');
    setTimeout(() => {
        mainWindow.webContents.send('docker-log', 'stopping');
    }, 1);

    currentProcess = spawn('bash', ['-c', `
        echo "Stopping web service..."
        sleep 2
        echo "Removing containers..."
        sleep 2
        echo "All containers stopped successfully"
    `]);

    currentProcess.stdout.on('data', (data) => {
        mainWindow.webContents.send('docker-log', data.toString());
    });

    currentProcess.on('close', (code) => {
        if (code === 0) {
            mainWindow.webContents.send('containers-stopped');
        }
        isOperationRunning = false;
        currentProcess = null;
    });
}

function removeSoftware(mainWindow) {
    if (currentProcess) {
        currentProcess.kill();
    }

    isOperationRunning = true;
    console.log('Removing software...');
    setTimeout(() => {
        mainWindow.webContents.send('docker-log', 'removing');
    }, 1);    

    currentProcess = spawn('bash', ['-c', `
        echo "Removing containers and volumes..."
        sleep 2
        echo "Cleaning up networks..."
        sleep 2
        echo "Removing images..."
        sleep 2
        echo "Software completely removed!"
    `]);

    currentProcess.stdout.on('data', (data) => {
        mainWindow.webContents.send('docker-log', data.toString());
    });

    currentProcess.on('close', (code) => {
        if (code === 0) {
            mainWindow.webContents.send('software-removed');
        }
        isOperationRunning = false;
        currentProcess = null;
    });
}

function checkContainerStatus() {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (isOperationRunning) {
                resolve('busy');
            } else {
                resolve(Math.random() > 0.5 ? 'running' : 'stopped');
            }
        }, 1000);
    });
}

module.exports = {
    checkDocker: () => true,
    startContainers,
    stopContainers,
    removeSoftware,
    checkContainerStatus
};
