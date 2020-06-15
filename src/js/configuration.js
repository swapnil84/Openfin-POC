const defaultWindowOptions = {
  name: 'OpenFin Application',
  autoShow: true,
  defaultCentered: true,
  alwaysOnTop: false,
  saveWindowState: true,
  icon: "favicon.ico",
  maxHeight: 600,
  defaultHeight: 600,
  minHeight: 600,
  maxWidth: 1100,
  minWidth: 1100,
  defaultWidth: 1100
}

export const detailsAppConfigs = {
  url: 'http://localhost:8080/components/stock-details/index.html',
  alwaysOnTop: true,
  contextMenu: true,
  provider: {
    platformName: 'openfin',
    applicationType: 'application',
    windowOptions: {
      ...defaultWindowOptions,
    }
  }
}