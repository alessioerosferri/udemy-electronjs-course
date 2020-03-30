const electron = require("electron");

const {app, BrowserWindow, Menu, ipcMain} = electron;
let mainWindow;
let addWindow;

app.on("ready", () => {
  mainWindow = new BrowserWindow({webPreferences: {nodeIntegration: true}});
  mainWindow.loadURL(`file://${__dirname}/main.html`);
  mainWindow.on("closed", () => {
    app.quit();
  });
  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);
});

function createAddWindow() {
  addWindow = new BrowserWindow({
    webPreferences: {nodeIntegration: true},
    height: 200,
    width: 300,
    title: "Add New Todo"
  });
  addWindow.loadURL(`file://${__dirname}/add.html`);
  addWindow.on("closed", ()=>{
    addWindow=null; //this allows NodeJS to reclaim the memory used by addWindow
  })
}

function clearTodos(){
  mainWindow.webContents.send("todo:clearAll");
}

ipcMain.on("todo:add", (event, todo)=>{
  mainWindow.webContents.send("todo:add", todo);
  addWindow.close();
});

const menuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "New Todo",
        accelerator: process.platform === "darwin" ? "Command+N" : "Ctrl+N",
        click() {
          createAddWindow();
        }
      },
      {
        label: "Clear Todos",
        click() {
          clearTodos();
        }
      },
      {
        label: "Quit",
        accelerator: process.platform === "darwin" ? "Command+Q" : "Ctrl+Q",
        click() {
          app.quit();
        }
      }
    ]
  }
];

if (process.platform === "darwin") { // adding a menu in mac os because otherwise File submenu is absorbed by app main menu
  menuTemplate.unshift({label: "File"});
}
if (process.env.NODE_ENV !== "production") { // adding devtools if not production
  menuTemplate.push({
    label: "View",
    submenu: [
      { role: "reload" }, //predefined template so we don't need to build this manually.
      {
        label: "Toggle Developer Tools", //this is another approach without using roles.
        accelerator: process.platform === "darwin" ? "Command+Alt+I" : "Ctrl+Shift+I",
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        }
      }
    ]
  });
}