const {app, dialog} = require('electron')

app.setAsDefaultProtocolClient('eleonas-manager-app')

app.on('open-url', (event, url) => {
  dialog.showErrorBox('Welcome Back', `You arrived from: ${url}`)
})
