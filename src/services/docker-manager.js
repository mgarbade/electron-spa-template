const { spawn } = require('child_process');
const { dialog } = require('electron');
const path = require('path');

function checkDocker() {
    try {
        // This will fail if Docker engine is not running
        const result = spawn('docker', ['ps']);
        return true;
    } catch {
        return false;
    }
}

let currentDockerProcess = null;

let isOperationRunning = false;

function startContainers(mainWindow) {
    console.log('Starting containers...');
    isOperationRunning = true;
    console.log('Starting containers simulation...');
    
    setTimeout(() => {
        mainWindow.webContents.send('docker-log', 'Creating network "app_default"...\n');
    }, 1000);
    
    setTimeout(() => {
        mainWindow.webContents.send('docker-log', 'Building web service...\n');
    }, 2000);
    
    setTimeout(() => {
        mainWindow.webContents.send('docker-log', 'Starting containers...\n');
    }, 3000);
    
    setTimeout(() => {
        isOperationRunning = false;
        mainWindow.webContents.send('containers-started');
        mainWindow.webContents.send('docker-log', 'All containers are up and running!\n');
    }, 4000);
}

function stopContainers(mainWindow) {
    isOperationRunning = true;
    console.log('Stopping containers simulation...');
    
    setTimeout(() => {
        mainWindow.webContents.send('docker-log', 'Stopping web service...\n');
    }, 1000);
    
    setTimeout(() => {
        mainWindow.webContents.send('docker-log', 'Removing containers...\n');
    }, 2000);
    
    setTimeout(() => {
        isOperationRunning = false;
        mainWindow.webContents.send('containers-stopped');
        mainWindow.webContents.send('docker-log', 'All containers stopped successfully\n');
    }, 3000);
}

function removeSoftware(mainWindow) {
    isOperationRunning = true;
    console.log('Removing software simulation...');
    
    setTimeout(() => {
        mainWindow.webContents.send('docker-log', 'Removing containers and volumes...\n');
    }, 1000);
    
    setTimeout(() => {
        mainWindow.webContents.send('docker-log', 'Cleaning up networks...\n');
    }, 2000);
    
    setTimeout(() => {
        mainWindow.webContents.send('docker-log', 'Removing images...\n');
    }, 3000);
    
    setTimeout(() => {
        isOperationRunning = false;
        mainWindow.webContents.send('software-removed');
        mainWindow.webContents.send('docker-log', 'Software completely removed!\n');
    }, 4000);
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

