document.getElementById('loadPage1').addEventListener('click', () => loadPage('page1.html'));
document.getElementById('loadPage2').addEventListener('click', () => loadPage('page2.html'));

function loadPage(page) {
    fetch(page)
        .then(response => response.text())
        .then(html => {
            document.getElementById('content').innerHTML = html;
            attachEventHandlers();
        });
}

function attachEventHandlers() {
    const page1Button = document.getElementById('page1Button');
    if (page1Button) {
        page1Button.addEventListener('click', () => {
            window.electronAPI.send('button-click', 'Page 1 button clicked!');
        });
    }

    const page2Button = document.getElementById('page2Button');
    if (page2Button) {
        page2Button.addEventListener('click', () => {
            window.electronAPI.send('button-click', 'Page 2 button clicked!');
        });
    }
}
