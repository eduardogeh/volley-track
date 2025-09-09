// preload.cjs (versão final)

const { contextBridge, ipcRenderer } = require('electron');

// Expõe um objeto 'api' para o front-end, onde cada função
// simplesmente invoca o handler correspondente no processo principal.
contextBridge.exposeInMainWorld('api', {
    team: {
        getAll: () => ipcRenderer.invoke('teams:getAll'),
        update: (team) => ipcRenderer.invoke('teams:update', team),
        create: (team) => ipcRenderer.invoke('teams:create', team),
        delete: (teamId) => ipcRenderer.invoke('teams:delete', teamId),
    },
    player: {
        getByTeamId: (teamId) => ipcRenderer.invoke('players:getByTeamId', teamId),
        create: (player) => ipcRenderer.invoke('players:create', player),
        update: (player) => ipcRenderer.invoke('players:update', player),
        updateOrder: (teamId, orderedIds) => ipcRenderer.invoke('players:updateOrder', teamId, orderedIds),
        delete: (playerId) => ipcRenderer.invoke('players:delete', playerId),
    },
    scout: {
        getAll: () => ipcRenderer.invoke('scout:getAll'),
        save: (model) => ipcRenderer.invoke('scout:save', model),
        delete: (id) => ipcRenderer.invoke('scout:delete', id),
    },
});