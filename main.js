const {app, BrowserWindow, dialog} = require('electron')
const fs = require('fs')

let win

function createWindow () {
  //win = new BrowserWindow({frame: false})
  win = new BrowserWindow({transparent: true, frame: false})

  win.loadURL(`file://${__dirname}/index.html`)
  win.on('closed', () => {
    win = null
  })
  win.webContents.openDevTools()
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  app.quit()
})
