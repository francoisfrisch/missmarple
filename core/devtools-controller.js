var Promise = require("montage/core/promise").Promise;

var ID = 0

var messagePort

if(chrome.runtime) {
    messagePort = chrome.runtime.connect({name: "devtools"});
    messagePort.postMessage({action: "register"});
    messagePort.onMessage.addListener(function(message) {
        console.log("message from background", message);
        if(message.reponseTo) {
            var deferred = messages[message.reponseTo];
            if(deferred) {
                deferred
            } else {
                console.warn("Unknown message from background", message);
            }
        }

    });
}

exports.devtoolsController = {};

var messages = {};

exports.devtoolsController.postMessage = function (action, data) {
    var deferred = Promise.defer();
    var id = "m-" + ID++;
    messages[id] = deferred;
    messagePort.postMessage({action: action, data: data, id: id});


    return deferred.promise;
}
