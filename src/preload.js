const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    getVersion: () => ipcRenderer.invoke('get-version'),
    send: (channel, data) => ipcRenderer.send(channel, data),

    // Docker Management
    startContainers: () => ipcRenderer.send('start-containers'),
    stopContainers: () => ipcRenderer.send('stop-containers'),
    removeSoftware: () => ipcRenderer.send('remove-software'),
    checkContainerStatus: () => ipcRenderer.invoke('check-container-status'),
    onContainersStarted: (callback) => ipcRenderer.on('containers-started', callback),
    onContainersStopped: (callback) => ipcRenderer.on('containers-stopped', callback),
    onSoftwareRemoved: (callback) => ipcRenderer.on('software-removed', callback),
    onDockerLog: (callback) => ipcRenderer.on('docker-log', callback)
})


