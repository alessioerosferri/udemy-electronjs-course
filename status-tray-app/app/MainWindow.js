const electron = require("electron");
const {BrowserWindow} = electron;
class MainWindow extends BrowserWindow{
  constructor(options, path) {
    super(options);
    this.loadURL(path);
    this.on("blur",this.onBlur.bind(this));
  }
  onBlur(){
    this.hide();
  }
}

module.exports = MainWindow;