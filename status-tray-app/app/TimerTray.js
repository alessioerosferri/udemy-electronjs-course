const electron = require("electron");
const {Tray} = electron;
class TimerTray extends Tray{
  constructor(iconPath, mainWindow) {
    super(iconPath);

    this.mainWindow = mainWindow;

    this.setToolTip("Timer App");
    this.on("click", this.onClick.bind(this));
  }
  onClick(event, bounds){
    const {x, y} = bounds;
    const {height, width} = this.mainWindow.getBounds();
    if (!this.mainWindow.isVisible()){
      const yPosition = process.platform === "darwin" ? y : y - height;
      this.mainWindow.setBounds({
        x: x - width/2,
        y: y,
        height: height,
        width: width
      });
      this.mainWindow.show();
    }
    else
      this.mainWindow.hide();
  }

}

module.exports = TimerTray;