const electron = require("electron");
const path = require("path");
const {app, ipcMain} = electron;
const TimeTray = require("./app/TimerTray");
const MainWindow = require("./app/MainWindow");

let mainWindow;
let tray;

app.on("ready", () => {
  app.dock.hide();
  mainWindow = new MainWindow({
    webPreferences: {nodeIntegration: true, backgroundThrottling: false},
    height: 500,
    width: 300,
    frame: false,
    resizable: false,
    show: false
  }, `file://${__dirname}/src/index.html`);

  const iconName = process.platform === "darwin" ? "iconTemplate.png" : "windows-icon@2x.png";

  tray = new TimeTray(path.join(__dirname, "src", "assets", iconName), mainWindow);
});

ipcMain.on("update-timer", (event, timerLeft)=>{
  tray.setTitle(timerLeft);
});