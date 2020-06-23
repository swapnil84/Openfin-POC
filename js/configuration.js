const defaultWindowOptions = {
  name: 'OpenFin Application',
  autoShow: true,
  defaultCentered: true,
  alwaysOnTop: false,
  saveWindowState: true,
  icon: "favicon.ico",
  maxHeight: 350,
  defaultHeight: 350,
  minHeight: 350,
  maxWidth: 900,
  minWidth: 900,
  defaultWidth: 900
}

export const detailsAppConfigs = {
  url: 'http://localhost:8080/components/stock-details/index.html',
  alwaysOnTop: true,
  contextMenu: true,
  position: {
    left: 500,
    top: 0
  },
  provider: {
    platformName: 'openfin',
    applicationType: 'application',
    windowOptions: {
      ...defaultWindowOptions,
    }
  }
}
