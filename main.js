const {app, BrowserWindow} = require('electron')

let win

function createWindow () {
  //win = new BrowserWindow({frame: false})
  win = new BrowserWindow({transparent: true, frame: false})

  win.loadURL(`file://${__dirname}/index.html`)

  //win.webContents.openDevTools()

  win.on('closed', () => {
    win = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  app.quit()
})
