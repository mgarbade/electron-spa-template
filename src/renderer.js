document.addEventListener('DOMContentLoaded', () => {
    
    // Footer - Show App Version
    window.electronAPI.getVersion()
    .then(version => {
        document.querySelector('#footer p').textContent = `Version ${version}`
    })

    // Nav Bar - Show Pages as Tabs
    document.getElementById('showPage1').addEventListener('click', () => {
        showPage('page1');
    });

    document.getElementById('showPage2').addEventListener('click', () => {
        showPage('page2');
    });

    function showPage(pageId) {
        // Hide all tab content
        const tabcontents = document.getElementsByClassName('tabcontent');
        for (let content of tabcontents) {
            content.style.display = 'none';
        }
        
        // Show the selected tab content
        document.getElementById(pageId).style.display = 'block';
    }

    // Show Page 1 by default
    showPage('page1');

    // Page 1 Buttons
    const page1Button = document.getElementById('page1Button')
    if (page1Button) {
        page1Button.addEventListener('click', () => {
            window.electronAPI.send('button-click', 'Page 1 button clicked!')
        })
    }


    // Page 2 Buttons
    const page2Button = document.getElementById('page2Button')
    if (page2Button) {
        page2Button.addEventListener('click', () => {
            window.electronAPI.send('button-click', 'Page 2 button clicked!')
        })
    }


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

    window.electronAPI.onContainersStarted((event, message) => {
        console.log('Containers started successfully');
    });

    window.electronAPI.onContainersStopped((event, message) => {
        console.log('Containers stopped successfully');
    });

    window.electronAPI.onSoftwareRemoved((event, message) => {
        console.log('Software removed successfully');
    });

    window.electronAPI.onDockerLog((event, message) => {
        console.log('Docker log:', message);
    });
});
