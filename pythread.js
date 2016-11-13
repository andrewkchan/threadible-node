var createPythonThread = function() {
    var spawn = require("child_process").spawn;
    var py = null;
    var outputString = "";
    var errString = "";
    
    var exports = {};
    exports.eval = function(data, cb) {
        py = spawn('python');
        /*Here we are saying that every time our node application receives data from the python process output stream(on 'data'), 
        we want to convert that received data into a string and append it to the overall dataString.*/
        py.stdout.on('data', function(data) {
          outputString += data.toString();
        });
        py.stderr.on("data", function(data) {
           errString += data.toString(); 
        });
        /*Once the stream is done (on 'end') we want to simply log the received data to the console.*/
        py.stdout.on('end', function(){
          cb(outputString, errString);
          outputString = "";
        });
        py.stdin.write(data);
        py.stdin.end();
    };
    return exports;
};

module.exports = createPythonThread;