// electron/main.cjs
const { app, BrowserWindow, ipcMain } = require('electron'); // -> NOVO: importado ipcMain
const path = require('path');

// -> NOVO: Importe os repositórios que contêm a lógica do banco de dados
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
            // -> NOVO: Garanta que o sandbox esteja ativado para segurança
            // Esta é a razão pela qual precisamos usar IPC.
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

// -> NOVO: Bloco inteiro de handlers da API via IPC
// O processo principal escuta por "invocações" do script de preload
// e executa a função correspondente do repositório.
// -------------------------------------------------------------------

// API para Times
ipcMain.handle('teams:getAll', () => {
    return teamRepository.getAll();
});
ipcMain.handle('teams:update', (event, team) => {
    teamRepository.update(team);
});
ipcMain.handle('teams:create', (event, team) => {
    return teamRepository.create(team);
});
ipcMain.handle('teams:delete', (event, teamId) => {
    teamRepository.delete(teamId);
});

// API para Jogadores
ipcMain.handle('players:getByTeamId', (event, teamId) => {
    return playerRepository.getByTeamId(teamId);
});
ipcMain.handle('players:create', (event, player) => {
    playerRepository.create(player);
});
ipcMain.handle('players:update', (event, player) => {
    playerRepository.update(player);
});
ipcMain.handle('players:updateOrder', (event, teamId, orderedIds) => {
    playerRepository.updateOrder(teamId, orderedIds);
});
ipcMain.handle('players:delete', (event, playerId) => {
    playerRepository.delete(playerId);
});

// API para Scouts
ipcMain.handle('scouts:getAll', () => scoutRepository.getAll());
ipcMain.handle('scouts:create', () => {
    return scoutRepository.create();
});

// API para Itens de Scout
ipcMain.handle('scoutItems:getByScoutId', (event, scoutId) => scoutItemRepository.getByScoutId(scoutId));


// -------------------------------------------------------------------


// O restante do seu código permanece o mesmo
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});