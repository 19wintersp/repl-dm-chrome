// execute script as soon as extension is installed or refreshed

chrome.tabs.onActivated.addListener(tab => {
    addScripts(tab);
})

function injectFile(file) {
    return new Promise((resolve) => {
        chrome.tabs.executeScript(null, { file }, () => resolve());
    });
}

function addScripts(tab) {
    chrome.tabs.get(tab.tabId, async currentTabInfo => {
        if (/^https:\/\/repl\.it/.test(currentTabInfo.url)) {
            chrome.tabs.insertCSS(null, {file: './repldm-page.css'});

            await Promise.all([
                injectFile("./jquery.min.js"),
                injectFile("./sanitize-html.js"),
                injectFile("./marked.min.js")
            ]);
            await injectFile("./foreground.js");
            console.log("i injected");
        }
    })
}

chrome.runtime.onMessage.addListener(
    () => {
        document.getElementById('notif-sound').play();
    }
);
