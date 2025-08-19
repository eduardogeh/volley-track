const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// Importa a função de inicialização do banco
const { initDatabase } = require('./database/connection.cjs');

// Importa os repositórios
const teamRepository = require('./database/teamRepository.cjs');
const playerRepository = require('./database/playerRepository.cjs');
const scoutRepository = require('./database/scoutRepository.cjs');
const scoutItemRepository = require('./database/scoutItemRepository.cjs');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            sandbox: true,
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
// (seus handlers continuam iguais)
ipcMain.handle('teams:getAll', () => teamRepository.getAll());
ipcMain.handle('teams:update', (event, team) => teamRepository.update(team));
ipcMain.handle('teams:create', (event, team) => teamRepository.create(team));
ipcMain.handle('teams:delete', (event, teamId) => teamRepository.delete(teamId));

ipcMain.handle('players:getByTeamId', (event, teamId) => playerRepository.getByTeamId(teamId));
ipcMain.handle('players:create', (event, player) => playerRepository.create(player));
ipcMain.handle('players:update', (event, player) => playerRepository.update(player));
ipcMain.handle('players:updateOrder', (event, teamId, orderedIds) => playerRepository.updateOrder(teamId, orderedIds));
ipcMain.handle('players:delete', (event, playerId) => playerRepository.delete(playerId));

ipcMain.handle('scouts:getAll', () => scoutRepository.getAll());
ipcMain.handle('scouts:create', () => scoutRepository.create());

ipcMain.handle('scoutItems:getByScoutId', (event, scoutId) => scoutItemRepository.getByScoutId(scoutId));

// ------------------ Inicialização ------------------
app.whenReady().then(() => {
    // Defina o caminho para o banco em uma pasta gravável
    const dbPath = path.join(app.getPath('userData'), 'volley-track.sqlite');

    // Inicializa o banco com schema
    initDatabase(dbPath);

    // Cria a janela principal
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
