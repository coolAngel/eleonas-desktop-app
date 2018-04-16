const path = require("path")
const url = require("url")

const { app, BrowserWindow, crashReporter } = require("electron")


crashReporter.start({
  productName: 'Eleonas Manager',
  companyName: 'coolLab',
  submitURL: 'https://github.com/coolAngel/eleonas-desktop-app/issues',
  autoSubmit: true
})

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow = null

function initialize () {
  const shouldQuit = makeSingleInstance()
  if (shouldQuit) return app.quit()

  function createWindow () {
    const windowOptions = {
      width: 1080,
      minWidth: 680,
      height: 840,
      minHeight: 520,
      title: app.getName()
    }

    if (process.platform === 'linux') {
      windowOptions.icon = path.join(__dirname, '/assets/app-icon/png/512.png')
    }
  }
}

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 800, height: 600 })

  // and load the index.html of the app.
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "app", "index.html"),
      protocol: "file:",
      slashes: true
    })
  )

  // Open the DevTools.
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools()
  }

  // Emitted when the window is closed.
  mainWindow.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow)

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit()
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
