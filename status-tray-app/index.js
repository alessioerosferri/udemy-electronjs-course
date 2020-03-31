const electron = require("electron");
const path = require("path");
const {app, BrowserWindow} = electron;
const TimeTray = require("./app/TimerTray");

let mainWindow;

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    webPreferences: {nodeIntegration: true},
    height: 500,
    width: 300,
    frame: false,
    resizable: false,
    show: false
  });
  mainWindow.loadURL(`file://${__dirname}/src/index.html`);

  const iconName = process.platform === "darwin" ? "iconTemplate.png" : "windows-icon@2x.png";

  new TimeTray(path.join(__dirname, "src", "assets", iconName), mainWindow);
});