const path = require("path")
const url = require("url")
const glob = require('glob')
const { app, BrowserWindow, crashReporter } = require("electron")
// const autoUpdater = require('./auto-updater')

const debug = /--debug/.test(process.argv[2])

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

  loadDemos()

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

    mainWindow = new BrowserWindow(windowOptions)
    // and load the index.html of the app.
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, "app", "index.html"),
        protocol: "file:",
        slashes: true
      })
    )

    // Launch fullscreen with DevTools open, usage: npm run debug
    if (debug) {
      mainWindow.webContents.openDevTools()
      mainWindow.maximize()
      require('devtron').install()
    }

    mainWindow.on('closed', () => {
      mainWindow = null
    })
  }


  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on("ready", () => {
    createWindow()
    // autoUpdater.initialize()
  })

  // Quit when all windows are closed.
  app.on("window-all-closed", () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
      app.quit()
    }
  })

  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) { createWindow() }
  })
}

// Make this app a single instance app.
//
// The main window will be restored and focused instead of a second window
// opened when a person attempts to launch a second instance.
//
// Returns true if the current version of the app should quit instead of
// launching.
function makeSingleInstance () {
  if (process.mas) return false

  return app.makeSingleInstance(() => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
}


// Require each JS file in the main-process dir
function loadDemos () {
  const files = glob.sync(path.join(__dirname, 'main-process/**/*.js'))
  files.forEach((file) => { require(file) })
  // autoUpdater.updateMenu()
}


// Handle Squirrel on Windows startup events
// switch (process.argv[1]) {
//   case '--squirrel-install':
//     autoUpdater.createShortcut(() => { app.quit() })
//     break
//   case '--squirrel-uninstall':
//     autoUpdater.removeShortcut(() => { app.quit() })
//     break
//   case '--squirrel-obsolete':
//   case '--squirrel-updated':
//     app.quit()
//     break
//   default:
//     initialize()
// }

initialize()
