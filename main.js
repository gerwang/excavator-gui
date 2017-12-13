/**
 * Created by Gerwa on 2017/12/11.
 */
const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');
const libexcavator = require('./excavator');
require('electron-debug')({enabled: true});

global.shared = {
    dll: new libexcavator(),
    loaded: null
};

let win;

app.on('ready', () => {
    win = new BrowserWindow({width: 1024, height: 768, icon: path.join(__dirname, 'favicon.ico')});
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));
    win.on('closed', () => {
        win = null;
    });
});

app.on('window-all-closed', () => {
    shared.dll.destroy();
    app.quit();
});