const path = require("path")
const url = require("url")
const glob = require('glob')
const { app, BrowserWindow, Menu, crashReporter } = require("electron")
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
let authWindow = null

function initialize () {
  const shouldQuit = makeSingleInstance()
  if (shouldQuit) return app.quit()

  loadDemos()

  function createWindow () {
    const windowOptions = {
      titleBarStyle: 'hidden',
      width: 1298,
      minWidth: 1298,
      height: 750,
      minHeight: 600,
      title: app.getName(),
      backgroundColor: '#312450',
      icon: path.join(__dirname, 'assets/app-icon/png/64.png'),
      show: false
    }

    if (process.platform === 'linux') {
      windowOptions.icon = path.join(__dirname, '/assets/app-icon/png/512.png')
    }

    mainWindow = new BrowserWindow(windowOptions)

    // and load the index.html of the app.
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file:",
        slashes: true
      })
    )
    
    if (!debug) {
      Menu.setApplicationMenu(null)
    }
    // Launch fullscreen with DevTools open, usage: npm run debug
    if (debug) {
      mainWindow.webContents.openDevTools()
      mainWindow.maximize()
      require('devtron').install()
    }

    // show the window when is ready.
    mainWindow.once('ready-to-show', () => {
      mainWindow.show()
    })
    

    mainWindow.on('closed', () => {
      mainWindow = null
    })

    authWindow.on('closed', () => {
      authWindow = null
    })
  }


  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on("ready", () => {
    console.log('app is ready. Time to create the main window. \nThe Window will be hidden until the ready-to-show event occurs.')
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

  app.on('login', (event, webContents, request, authInfo, callback) => {
    event.preventDefault()

    console.log('app login event...')
    callback('username', 'secret')
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
