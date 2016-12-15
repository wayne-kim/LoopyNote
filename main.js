const {app, BrowserWindow, dialog} = require('electron')
const fs = require('fs')

let win

app.on('ready', function(){
  win = new BrowserWindow({frame: false})

  win.loadURL(`file://${__dirname}/render.html`)
  win.on('closed', () => {
    win = null
  })
  win.webContents.openDevTools()
})

app.on('window-all-closed', () => {
  app.quit()
})
