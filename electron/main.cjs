const { app, BrowserWindow, ipcMain, dialog, protocol } = require('electron'); // <<< A MUDANÇA ESTÁ AQUI
const path = require('path');
const url = require('url');
const express = require('express');
const getPort = require('get-port');

const { initDatabase } = require('./database/connection.cjs');
let mediaServerUrl = '';

const teamRepository = require('./database/teamRepository.cjs');
const playerRepository = require('./database/playerRepository.cjs');
const scoutRepository = require('./database/scoutRepository.cjs');
const projectRepository = require('./database/projectRepository.cjs');


async function startMediaServer() {
    const server = express();

    // <<< A CORREÇÃO ESTÁ AQUI: USANDO UMA EXPRESSÃO REGULAR >>>
    // Esta RegExp corresponde a '/media/' seguido por um ou mais caracteres (.+),
    // que são capturados no primeiro grupo ().
    server.get(/\/media\/(.+)/, (req, res) => {
        try {
            // O caminho capturado estará em req.params[0]
            const filePath = decodeURIComponent(req.params[0]);
            console.log(`[MediaServer] Servindo arquivo: ${filePath}`);
            res.sendFile(filePath);
        } catch (error) {
            console.error('[MediaServer] Erro ao servir arquivo:', error);
            res.status(500).send('Erro ao servir arquivo.');
        }
    });

    const port = await getPort();
    server.listen(port, () => {
        mediaServerUrl = `http://localhost:${port}`;
        console.log(`[MediaServer] Servidor de mídia rodando em: ${mediaServerUrl}`);
    });
}

// IPC para o frontend descobrir a URL do servidor
ipcMain.handle('get-media-server-url', () => {
    return mediaServerUrl;
});

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            sandbox: false,
            contextIsolation: true,
        },
    });

    if (process.env.VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }
}

// ------------------ IPC ------------------
ipcMain.handle('teams:getAll', () => teamRepository.getAll());
ipcMain.handle('teams:update', (event, team) => teamRepository.update(team));
ipcMain.handle('teams:create', (event, team) => teamRepository.create(team));
ipcMain.handle('teams:delete', (event, teamId) => teamRepository.delete(teamId));

ipcMain.handle('players:getByTeamId', (event, teamId) => playerRepository.getByTeamId(teamId));
ipcMain.handle('players:create', (event, player) => playerRepository.create(player));
ipcMain.handle('players:update', (event, player) => playerRepository.update(player));
ipcMain.handle('players:updateOrder', (event, teamId, orderedIds) => playerRepository.updateOrder(teamId, orderedIds));
ipcMain.handle('players:delete', (event, playerId) => playerRepository.delete(playerId));

ipcMain.handle('scout:getAll', () => scoutRepository.getAll());
ipcMain.handle('scout:getById', (event, id) => scoutRepository.getById(id));
ipcMain.handle('scout:save', (event, model) => scoutRepository.save(model));
ipcMain.handle('scout:delete', (event, id) => scoutRepository.delete(id));

ipcMain.handle('projects:getAll', () => projectRepository.getAll());
ipcMain.handle('projects:getById', (event, id) => projectRepository.getById(id));
ipcMain.handle('projects:create', (event, project) => projectRepository.create(project));
ipcMain.handle('projects:update', (event, project) => projectRepository.update(project));
ipcMain.handle('projects:delete', (event, projectId) => projectRepository.delete(projectId));

ipcMain.handle('dialog:openFile', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [
            { name: 'Videos', extensions: ['mp4', 'mov', 'avi', 'mkv'] }
        ]
    });
    if (!canceled) {
        return filePaths[0];
    }
    return null;
});

// ------------------ Inicialização ------------------
app.whenReady().then(async () => {
    await startMediaServer();

    const dbPath = path.join(app.getPath('userData'), 'volley-track.sqlite');
    initDatabase(dbPath);
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});