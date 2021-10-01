const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const path = require('path')
const { generate } = require('./app/scripts/exportfile')

require('@electron/remote/main').initialize()
// include the Node.js 'path' module at the top of your file

process.env.NODE_ENV = 'production'

let MENU_TEMPLATE = [
    {
        label: 'Menu',
        submenu: [
            {
                label: 'Exit',
                click() {
                    app.quit()
                },
            },
        ],
    },
]

if (process.env.NODE_ENV !== 'production') {
    MENU_TEMPLATE.push({
        label: 'Developer Tools',
        submenu: [
            {
                role: 'reload',
            },
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools()
                },
            },
        ],
    })
}

// modify your existing createWindow() function
function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        icon: path.join(__dirname, 'app/assets/icons/icon.ico'),
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false,
            preload: path.join(__dirname, 'app/scripts/preload.js'),
            devTools: true,
        },
    })

    win.loadFile(path.join(__dirname, 'app/index.html'))

    let menu = Menu.buildFromTemplate(MENU_TEMPLATE)

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
    // console.log('Recieved from main', payload)
    payload['filename'] = `dab-semester-layout-${Date.now().toString()}.xlsx`
    generate(payload)
    // send message to index.html
    e.sender.send('form:reply', payload.filename)
})
