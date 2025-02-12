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
});
