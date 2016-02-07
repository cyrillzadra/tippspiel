cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-console/www/console-via-logger.js",
        "id": "cordova-plugin-console.console",
        "clobbers": [
            "console"
        ]
    },
    {
        "file": "plugins/cordova-plugin-console/www/logger.js",
        "id": "cordova-plugin-console.logger",
        "clobbers": [
            "cordova.logger"
        ]
    },
    {
        "file": "plugins/cordova-plugin-device/www/device.js",
        "id": "cordova-plugin-device.device",
        "clobbers": [
            "device"
        ]
    },
    {
        "file": "plugins/cordova-plugin-inappbrowser/www/inappbrowser.js",
        "id": "cordova-plugin-inappbrowser.inappbrowser",
        "clobbers": [
            "cordova.InAppBrowser.open",
            "window.open"
        ]
    },
    {
        "file": "plugins/cordova-plugin-globalization/www/GlobalizationError.js",
        "id": "cordova-plugin-globalization.GlobalizationError",
        "clobbers": [
            "window.GlobalizationError"
        ]
    },
    {
        "file": "plugins/cordova-plugin-globalization/www/globalization.js",
        "id": "cordova-plugin-globalization.globalization",
        "clobbers": [
            "navigator.globalization"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-console": "1.0.2",
    "cordova-plugin-device": "1.1.1",
    "cordova-plugin-whitelist": "1.2.1",
    "cordova-plugin-inappbrowser": "1.2.1",
    "cordova-plugin-globalization": "1.0.2"
}
// BOTTOM OF METADATA
});