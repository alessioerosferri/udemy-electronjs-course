const electron = require("electron");

const {app, BrowserWindow} = electron;

app.on("ready", ()=>{
   new BrowserWindow({webPreferences:{nodeIntegration:true}});
});