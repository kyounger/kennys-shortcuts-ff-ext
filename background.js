function debug(message) {
  console.debug(["[Kennys Shortcuts] ", message]);
}
function onError(error) {
  console.error(`[Kennys Shortcuts]Error: ${error}`);
}

async function getContextByName(contextName) {
  var contexts = await browser.contextualIdentities.query({ name: contextName });
  return contexts[0];
}

async function getContexts() {
  return await browser.contextualIdentities.query({});
}

async function reopenTabInContainer(containerName) {
  console.debug("here3:", containerName)
  var currentTab = browser.tabs.query({ currentWindow: true, active: true });
  var destinationContainerCookieStoreId = await getContainerCookieStoreId(containerName);

  currentTab.then((tabs) => {
    var currentTabInfo = browser.tabs.get(tabs[0].id);

    currentTabInfo.then((tab) => {
      if (tab.status == "complete") {
        var currentURL = tab.url;
        var currentIndex = tab.index;
        var currentPinned = tab.pinned;

        browser.tabs.create({
          url: currentURL,
          cookieStoreId: destinationContainerCookieStoreId,
          index: currentIndex + 1,
          pinned: currentPinned
        });
      }
    });
  });
}

async function getContainerCookieStoreId(contextName) {
  let context;
  try {
    context = await getContextByName(contextName);
  } catch (e) {
    console.error(e);
    return;
  }

  return context.cookieStoreId
}

// [COMMANDS] register commands
function onContainerCommand(command) {
  if (command == 'kennys-shortcuts-1') {
    reopenTabInContainer("Personal");
    return;
  } else if (command == 'kennys-shortcuts-2') {
    reopenTabInContainer("Work");
    return;
  }
}
browser.commands.onCommand.addListener(onContainerCommand);
console.debug("Kenny's Plugin init.")
