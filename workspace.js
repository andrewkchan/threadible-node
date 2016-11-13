//finish this when start to implement multiple workspaces.

var Workspace = function(workspace_id) {
    var cells = [];
    var sockets = [];
    
    var publicExports = {};
    
    publicExports.get_id = function() {
        return workspace_id;
    }
    
    return publicExports;
}

module.exports = Workspace;