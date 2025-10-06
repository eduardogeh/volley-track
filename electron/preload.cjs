const { contextBridge, ipcRenderer } = require('electron');

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
        getById: (id) => ipcRenderer.invoke('scout:getById', id),
        save: (model) => ipcRenderer.invoke('scout:save', model),
        delete: (id) => ipcRenderer.invoke('scout:delete', id),
    },
    project: {
        getAll: () => ipcRenderer.invoke('projects:getAll'),
        getById: (id) => ipcRenderer.invoke('projects:getById', id),
        create: (project) => ipcRenderer.invoke('projects:create', project),
        update: (project) => ipcRenderer.invoke('projects:update', project),
        delete: (projectId) => ipcRenderer.invoke('projects:delete', projectId),
    },
    playerAction: {
        create: (action) => ipcRenderer.invoke('player-actions:create', action),
        getByProjectId: (projectId) => ipcRenderer.invoke('player-actions:getByProjectId', projectId),
    },
    dialog: {
        openFile: () => ipcRenderer.invoke('dialog:openFile'),
    },
    getMediaServerUrl: () => ipcRenderer.invoke('get-media-server-url'),
});