module AspNet5Gulpization.Application {
  export class Instance {
    private notificator: AspNet5Gulpization.Services.Notificator;

    public constructor() {
      this.notificator = new AspNet5Gulpization.Services.Notificator();
    }

    public alert(): void {
      alert("Alert from AspNet5Gulpization.Application.Instance!");
    }

    public getService(): AspNet5Gulpization.Services.Notificator {
      return this.notificator;
    }
  }
}

var app;

window.onload = function () {
  app = new AspNet5Gulpization.Application.Instance();
  app.alert();
  app.getService().notify();
}