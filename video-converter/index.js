const electron = require("electron");
const ffmpeg = require("fluent-ffmpeg");

const {app, BrowserWindow, ipcMain} = electron;

let mainWindow;

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      backgroundThrottling: false
    },
    height: 600,
    width: 800
  });
  mainWindow.loadURL(`file://${__dirname}/src/index.html`);
});

ipcMain.on("videos:add", (event, videos) => {
  const promises = videos.map(video => {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(video.path, (err, metadata) => {
        if (err)
          reject(err);
        else
          resolve({
            ...video,
            duration: metadata.format.duration,
            format:"avi"
          });
      })
    });
  });
  Promise.all(promises).then((data) => {
    mainWindow.webContents.send("videos:metadata", data);
  });
});