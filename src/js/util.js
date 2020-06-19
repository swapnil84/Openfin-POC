import { STOCKSLIST_WINDOW_UUID } from './constants.js';

async function createAndRunOpenFinWindow({
  name,
  url,
  uuid,
  windowOptions,
  winLoc
}) {
  const winOptions = {
    name,
    url,
    nonPersistent: true,
    mainWindowOptions: windowOptions
  }
  return new Promise((resolve, reject) => {
    const win = new fin.desktop.Window(
      winOptions,
      function() {
        const options = {
          moveIndependently: false
        }
        win.showAt(winLoc.left, winLoc.top, options);
      },
      function(error) {
          console.log("Error creating window:", error);
      }
    )
  })
  // return await fin.Window.create(appOptions);
}

// If Window Already Opened Restore It
async function restoreExistingWindow(existingWindow) {
  const curState = await existingWindow.getState();
  await existingWindow.restore();
  await existingWindow.bringToFront();
}

export async function getExistingOpenFinWindow(name) {
  const allWindows = await fin.System.getAllWindows();
  const currentWindow = await fin.Window.getCurrent();
  const targetWindow = getCurrentApplication(allWindows, currentWindow)['childWindows'].some(app => {
    return app.name === name
  })
  if (targetWindow) {
    return fin.Window.wrap({ uuid: STOCKSLIST_WINDOW_UUID, name: name })
  }
}

function getCurrentApplication(allWindows, currentWindow) {
  var curWindow;
  allWindows.forEach(win => {
    if (win.uuid === currentWindow.identity.uuid) {
      curWindow = win
    }
  })
  return curWindow;
}

export async function createOrBringToFrontOpenFinWindow({
  name,
  url,
  uuid,
  windowOptions,
  winLoc
}) {
  // const { provider, url, name, uuid } = config
  const existingWindow = await getExistingOpenFinWindow(name)
  if (existingWindow) {
      await restoreExistingWindow(existingWindow)
      return existingWindow
  }

  return createAndRunOpenFinWindow({ name, url, uuid, windowOptions, winLoc });  
}

export function handleWindow(
  provider,
  name,
  uuid,
  url,
  winLoc
) {
  return createOrBringToFrontOpenFinWindow({
    name,
    url,
    uuid,
    windowOptions: provider.windowOptions,
    winLoc
  })
}


// Get All The Existing Applications
export async function getExistingOpenFinApplication(uuid) {
  const allApps = await fin.System.getAllApplications()
  const targetApp = allApps.some(app => app.uuid === uuid)
  if (targetApp) {
    return fin.Application.wrap({ uuid })
  }
}

// If Application Already Opened Restore It
async function restoreExistingApp(existingApp) {
  const isRunning = await existingApp.isRunning()
  if (!isRunning) {
    await existingApp.run()
    return
  }

  const window = await existingApp.getWindow()
  await window.restore()
  await window.bringToFront()
}

async function createAndRunOpenFinApplication({
  name,
  url,
  uuid,
  windowOptions
}) {
  const appOptions = {
    name,
    url,
    uuid,
    nonPersistent: true,
    mainWindowOptions: windowOptions
  }
  return new Promise(function(resolve, reject) {
    var SpawnedApplication = new fin.desktop.Application(appOptions, function () {
        // Ensure the spawned application are closed when the main application is closed.
        console.log("running");
        SpawnedApplication.run();
        resolve(SpawnedApplication)
    });
  })
  // return await fin.Application.start(appOptions)
}

export async function createOrBringToFrontOpenFinApplication({
  name,
  url,
  uuid,
  windowOptions
}) {
  // const { provider, url, name, uuid } = config
  const existingApp = await getExistingOpenFinApplication(uuid)
  if (existingApp) {
      await restoreExistingApp(existingApp)
      return existingApp
  }

  return createAndRunOpenFinApplication({ name, url, uuid, windowOptions });  
}

export function handleApplication(
  provider,
  name,
  uuid,
  url
) {
  if (!provider.windowOptions) {
    console.error(`Error opening app - windowOptions object is missing`)
    return
  }
  if (typeof url === 'undefined') {
    console.error(`Error opening app - url is missing`)
    return
  }
  return createOrBringToFrontOpenFinApplication({
    name,
    url,
    uuid,
    windowOptions: provider.windowOptions
  })
}

export async function open(config, winLoc) {
    const { provider, url, name, uuid } = config
    // Not under openfin -> open as url on browser
    if (typeof fin === 'undefined') {
      return window.open(config.url, config.name)
    }
    // open as url through openfin
    if (provider && provider.platformName === 'browser') {
      return new Promise((resolve, reject) => {
        if (typeof config.url !== 'string') {
          console.error(`Error opening with browser - url should be a string`)
          return
        }
        fin.desktop.System.openUrlWithBrowser(config.url, resolve, reject)
      })
    }
    // open new openfin application
    if (provider && provider.platformName === 'openfin') {
      switch (provider.applicationType) {
        case 'window':
          return handleWindow(provider, name, uuid, url, winLoc)
        case 'application':
        default:
          return handleApplication(provider, name, uuid, url)
      }
    }
  }