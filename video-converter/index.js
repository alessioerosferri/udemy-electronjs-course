const electron = require("electron");
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfprobePath(require('@ffprobe-installer/ffprobe').path);
ffmpeg.setFfmpegPath(require('@ffmpeg-installer/ffmpeg').path);
const _ = require("lodash");
const {app, BrowserWindow, ipcMain, shell} = electron;
const Jimp = require('jimp');
const im = require("imagemagick");

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
  mainWindow.loadFile("build/index.html");
  // mainWindow.loadURL(`file://${__dirname}/build/index.html`);
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
    const {orientation} = video;
    if(video.name.endsWith("jpg") || video.name.endsWith("png")){
      const outputPath = `${outputDir}${outputName}_output.jpg`;
      im.convert([video.path, '-colorspace', 'yuv', outputPath],
        function(err, stdout){
          if (err) throw err;
          Jimp.read(outputPath, (err, image) => {
            if (err) throw err;
            if(orientation){
              image
                .rotate(parseInt(orientation), Jimp.RESIZE_BEZIER, function(err){
                  if (err) throw err;
                })
                .write(outputPath);
            }
            image
              .quality(95)
              .write(outputPath);
            mainWindow.webContents.send("video:converted", {video, outputPath});
          });
        });
    } else {
      let videoFormat;
      switch (parseInt(orientation)) {
        case 90:
          videoFormat = "format=yuv420p,transpose=2";
          break;
        case 270:
          videoFormat = "format=yuv420p,transpose=1";
          break;
        case 180:
          videoFormat = "format=yuv420p,transpose=2,transpose=2";
          break;
        default:
          videoFormat = "format=yuv420p";
          break;
      }
      const outputPath = `${outputDir}${outputName}_output.mp4`;
      ffmpeg(video.path)
        .videoCodec('libx264')
        .outputOptions(['-crf 23',"-an","-color_primaries 1","-color_trc 1","-colorspace 1",`-vf ${videoFormat}`])
        .output(outputPath)
        .on("progress", ({timemark}) => {
          mainWindow.webContents.send("conversion:progress", {video, timemark});
        })
        .on("end", () => {
          mainWindow.webContents.send("video:converted", {video, outputPath})
        })
        .run();
    }
  });
}));

ipcMain.on("video:open", (event, path)=>{
  shell.showItemInFolder(path);
});