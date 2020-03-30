const electron = require("electron");
const path = require("path");
const {app, BrowserWindow, Tray} = electron;

let mainWindow;

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    webPreferences: {nodeIntegration: true},
    height: 500,
    width: 300,
    frame: false,
    resizable: false
  });
  mainWindow.loadURL(`file://${__dirname}/src/index.html`);

  const iconName = process.platform === "darwin" ? "iconTemplate.png" : "windows-icon@2x.png";
  new Tray(path.join(__dirname, "src", "assets", iconName));
});