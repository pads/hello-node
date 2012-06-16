var http = require('http');
var path = require('path');
var fileSystem = require('fs');
var extensions = {
	'.html': 'text/html',
	'.css': 'text/css',
	'.js': 'application/javascript',
	'.png': 'image/png',
	'.gif': 'image/gif',
	'.jpg': 'image/jpeg'
};

http.createServer(function(request, response) {
	var filename = path.basename(request.url) || 'index.html'
	var extension = path.extname(filename)
	var directory = path.dirname(request.url).substring(1);
	var localPath = __dirname + '/public/';
	
	if(extensions[extension]) {
		localPath += (directory ? directory + '/' : '') + filename;
		path.exists(localPath, function(exists) {
			if(exists) {
				getFile(localPath, extensions[extension], response);
			}	else {
				response.writeHead(404);
				response.end();			
			}
		});	
	}
	
}).listen(8000);

function getFile(localPath, mimeType, response) {
	fileSystem.readFile(localPath, function(error, contents) {
		if(error) {
			response.writeHead(500, {
				'Content-Type': mimeType,
				'Content-Length': contents.length
			});
			response.end();
		} else {
			response.end(contents);		
		}
	});	
}
