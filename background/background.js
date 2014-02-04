var Connection = require("q-connection");

var ConnectionController = function() {};
ConnectionController.prototype.connection = null;
ConnectionController.prototype.status = "disconnected";
ConnectionController.prototype.ready = function () {
    return this.connection !== null && this.status === "connected";
};
ConnectionController.prototype.connect = function (port) {
    this.connection = Connection(port, background);
    this.status = "connected";
    port.onDisconnect.addListener(this.disconnect);
    if(port.name === "content") {
        debugger;
        this.connection.invoke("componentTree")
    }
};
ConnectionController.prototype.disconnect = function (port) {
    this.connection = null;
    this.status = "disconnected";
    port.onDisconnect.removeListener(this.disconnect);
};

function setupPorts(connectionControllers) {
    chrome.runtime.onConnect.addListener(function(port) {
        var connectionController = connectionControllers[port.name];
        if(connectionController) {
            if(connectionController.port !== null) {
                console.warn("connectionController.port is not null for " + port.name);
                //need to cleanup
                connectionController.disconnect(port);
            }
            connectionController.connect(port);
        } else {
            console.log("connectionController doesn't exist for " + port.name);
        }
    });
};

var bar
var background = {
    foo: function () {
        return bar;
    }
}




var connectionControllers = {
    "devtools": new ConnectionController(),
    "content": new ConnectionController()
};
setupPorts(connectionControllers);

function portStatus(portController) {

}






//// notify of page refreshes
//chrome.extension.onConnect.addListener(function(port) {
//    port.onMessage.addListener(function (message) {
//        if (message.action === "register") {
//            var listener = function (tabId, changeInfo, tab) {
//                if (tabId !== message.inspectedTabId) {
//                    return;
//                }
//                port.postMessage("refresh");
//            };
//
//            chrome.tabs.onUpdated.addListener(listener);
//            port.onDisconnect.addListener(function () {
//                chrome.tabs.onUpdated.removeListener(listener);
//            });
//        }
//    });
//});

// Populate the routes for chrome-devtools-autosave

localStorage.routes = JSON.stringify([{
    id: '0',
    match: '^http://localhost:8081/',
    savePath: '/Users/francois/declarativ/'
}]);
localStorage.servers = JSON.stringify([{
    id: '0',
    url: 'http://127.0.0.1:9104'
}]);
