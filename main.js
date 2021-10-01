const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const path = require('path')
const ex = require('./app/scripts/exportfile')

require('@electron/remote/main').initialize()
// include the Node.js 'path' module at the top of your file

// modify your existing createWindow() function
function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false,
            preload: path.join(__dirname, 'app/scripts/preload.js'),
            devTools: true,
        },
    })

    win.loadFile(path.join(__dirname, 'app/index.html'))

    /*win.on("closed", () => {
    win = null;
  });*/

    let menu = Menu.buildFromTemplate([
        {
            label: 'Menu',
            submenu: [
                {
                    label: 'Toggle Devtools',
                    accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                    click(item, focusedWindow) {
                        focusedWindow.toggleDevTools()
                    },
                },
                { label: 'Export' },
                {
                    label: 'Exit',
                    click() {
                        app.quit()
                    },
                },
            ],
        },
    ])

    Menu.setApplicationMenu(menu)
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('form:send', (e, payload) => {
    console.log('Recieved from main', payload)

    // send message to index.html
    e.sender.send('asynchronous-reply', true)
})
