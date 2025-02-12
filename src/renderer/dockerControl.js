document.addEventListener('DOMContentLoaded', () => {
    
    // Docker control buttons
    document.getElementById('startContainersBtn').addEventListener('click', () => {
        window.electronAPI.startContainers();
    });

    document.getElementById('stopContainersBtn').addEventListener('click', () => {
        window.electronAPI.stopContainers();
    });

   
    document.getElementById('removeSoftwareBtn').addEventListener('click', () => {
        window.electronAPI.removeSoftware();
    });


    const statusText = document.getElementById('statusText');

    function updateStatus(status) {
        statusText.textContent = status;
    }
    
    window.electronAPI.onContainersStarted((event, message) => {
        console.log('Containers started successfully');
        updateStatus('Containers started.')
    });
    
    window.electronAPI.onContainersStopped((event, message) => {
        console.log('Containers stopped successfully');
        updateStatus('Containers stopped.')
    });
    
    window.electronAPI.onSoftwareRemoved((event, message) => {
        console.log('Software removed successfully');
        updateStatus('Containers removed.')
    });

    window.electronAPI.onDockerLog((event, message) => {
        console.log('Docker log:', message);
        if (message.includes('Starting')) updateStatus('Starting...');
        if (message.includes('Stopping')) updateStatus('Stopping...');
    });
});
