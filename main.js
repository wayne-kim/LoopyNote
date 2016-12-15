const {app, BrowserWindow, dialog} = require('electron')
const fs = require('fs')

let win

function createWindow () {
  //win = new BrowserWindow({frame: false})
  win = new BrowserWindow({transparent: false, frame: false})

  win.loadURL(`file://${__dirname}/render.html`)
  win.on('closed', () => {
    win = null
  })
  win.webContents.openDevTools()
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  app.quit()
})
