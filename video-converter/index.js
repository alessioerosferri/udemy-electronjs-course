const electron = require("electron");
const ffmpeg = require("fluent-ffmpeg");
const _ = require("lodash");

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
            format: "avi"
          });
      })
    });
  });
  Promise.all(promises).then((data) => {
    mainWindow.webContents.send("videos:metadata", data);
  });
});

ipcMain.on("videos:convert", ((event, videos) => {
  _.each(videos, (video) => {
    const outputDir = video.path.split(video.name)[0];
    const outputName = video.name.split(".")[0];
    const outputPath = `${outputDir}${outputName}.${video.format}`;

    ffmpeg(video.path)
      .output(outputPath)
      .on("progress", ({timemark}) => {
        mainWindow.webContents.send("conversion:progress", {video, timemark});
      })
      .on("end", () => {
        mainWindow.webContents.send("video:converted", {video, outputPath})
      })
      .run();
  });
}));