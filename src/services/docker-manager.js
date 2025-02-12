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

function startContainers(mainWindow, basePath) {
    console.log('Checking Docker availability...');
    if (!checkDocker()) {
        dialog.showMessageBox(mainWindow, {
            type: 'warning',
            title: 'Docker Not Found',
            message: 'Docker is not available',
            detail: 'Please make sure Docker Desktop is installed and running on your system.'
        });
        mainWindow.webContents.send('containers-stopped');
        return;
    }
    console.log('Docker is available'); 

    console.log('Starting containers...');
    const dockerComposePath = path.join(basePath, 'app', 'docker-compose-client.yml');
    console.log('Docker Compose path:', dockerComposePath);

    const dockerProcess = spawn('docker', ['compose', '-f', dockerComposePath, 'up', '-d', '--build']);
    currentDockerProcess = dockerProcess;
    
    console.log('Docker process started');
    dockerProcess.stdout.on('data', (data) => {
        mainWindow.webContents.send('docker-log', data.toString());
    });

    dockerProcess.stderr.on('data', (data) => {
        mainWindow.webContents.send('docker-log', data.toString());
    });

    dockerProcess.on('close', (code) => {
        if (code === 0) {
            mainWindow.webContents.send('containers-started');
        }
    });
    dockerProcess.on('error', (error) => {
        mainWindow.webContents.send('docker-log', `Error: ${error.message}`);
    });
}

function stopContainers(mainWindow, basePath) {

    if (currentDockerProcess) {
        currentDockerProcess.kill();
        currentDockerProcess = null;
    }

    const dockerComposePath = path.join(basePath, 'app', 'docker-compose-client.yml');
    const dockerProcess = spawn('docker', ['compose', '-f', dockerComposePath, 'down']);

    dockerProcess.stdout.on('data', (data) => {
        mainWindow.webContents.send('docker-log', data.toString());
    });

    dockerProcess.stderr.on('data', (data) => {
        mainWindow.webContents.send('docker-log', data.toString());
    });

    dockerProcess.on('close', (code) => {
        if (code === 0) {
            mainWindow.webContents.send('containers-stopped');
        }
    });
}

function removeSoftware(mainWindow, basePath) {
    if (!checkDocker()) {
        dialog.showMessageBox(mainWindow, {
            type: 'warning',
            title: 'Docker Not Found',
            message: 'Docker is not available',
            detail: 'Please make sure Docker Desktop is installed and running on your system.'
        });
        return;
    }

    const dockerComposePath = path.join(basePath, 'app', 'docker-compose-client.yml');
    // First, bring down containers, volumes, and networks
    const downProcess = spawn('docker', ['compose', '-f', dockerComposePath, 'down', '--volumes', '--remove-orphans']);

    downProcess.on('close', (code) => {
        if (code !== 0) {
            mainWindow.webContents.send('docker-log', `Error stopping containers: ${code}`);
            mainWindow.webContents.send('removal-error');
            return;
        }

        // Remove images associated with this compose file
        const rmImagesProcess = spawn('docker', ['compose', '-f', dockerComposePath, 'down', '--rmi', 'all']);

        rmImagesProcess.stdout.on('data', (data) => {
            mainWindow.webContents.send('docker-log', data.toString());
        });

        rmImagesProcess.stderr.on('data', (data) => {
            mainWindow.webContents.send('docker-log', data.toString());
        });

        rmImagesProcess.on('close', (code) => {
            if (code === 0) {
                mainWindow.webContents.send('software-removed');
            } else {
                mainWindow.webContents.send('docker-log', `Error removing images: ${code}`);
                mainWindow.webContents.send('removal-error');
            }
        });
    });
}



function checkContainerStatus() {
    console.log('Checking container status...');

    if (!currentDockerProcess) {
        console.log('No current Docker process');
        return false;
    }

    const result = spawn('docker', ['ps', '--format', '{{.Names}}']);
    return new Promise((resolve) => {
        let output = '';
        result.stdout.on('data', (data) => {
            output += data.toString();
        });
        result.on('close', () => {
            const isRunning = output.includes('gadoboost');
            console.log('Docker container status:', output);
            console.log('Is gadoboost running:', isRunning);
            resolve(isRunning);
        });
    });
}

module.exports = {
    checkDocker,
    startContainers,
    stopContainers,
    removeSoftware,
    checkContainerStatus
};
