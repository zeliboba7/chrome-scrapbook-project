handleDownloadFile = function(request, sendResponse) {
	try {
		var req = new XMLHttpRequest();
		req.open('GET', request.href, false);
		if (request.binary) req.overrideMimeType('text/plain; charset=x-user-defined');
		req.send();
	if (req.readyState == 4 && req.status == 200) {
	  request.contentType = req.getResponseHeader('Content-Type');
	  request.data = req.responseText;
	  request.status = 'OK';
	}
	else {
	  request.message = "Unexpected error";
	  request.status = 'BAD';
	}
  }
  catch (e) {
	console.error('Download error: ' + e.message);
	
	request.message = e.message;
	request.status = 'BAD';
  }
  sendResponse(request);
}	
/**
 * Caching for speed up. Need to move this operaion to web workers 
 */
redoFolderMenuCache = function(callback){
	getFoldersDB(function(sBookdata){ 
	
		var sbookFolder = new Array(sBookdata.rows.length);

		for(i=0;i<sBookdata.rows.length;i++){
		
			sbookFolder[i] = [sBookdata.rows.item(i).foldername , sBookdata.rows.item(i).folderid, sBookdata.rows.item(i).level, sBookdata.rows.item(i).parentid]
		
		}
		
		var sortedByLevel = {};
		for(i = 0; i < sbookFolder.length; i++){
			
			if(sortedByLevel[sbookFolder[i][2]] == undefined || sortedByLevel[sbookFolder[i][2]] == null){
				sortedByLevel[sbookFolder[i][2]] = [sbookFolder[i]];
			}
			else{
				var levelElements = sortedByLevel[[sbookFolder[i][2]]];
				sortedByLevel[sbookFolder[i][2]] = levelElements.concat([sbookFolder[i]]);
			}
				
		}

		window.folderMenuCache = sortedByLevel;
		callback();
	},function(error){
		console.error('Error while making folder cache: '+error.message);
	});
	
}

flushFolderMenuCache = function(){
	window.folderMenuCache = null;
	window.folderDDHTML = null;
}


redoPageMenuCache = function(callback){
	getPagesDB(function(sBookdata){
			
		var sBookPages = new Array(sBookdata.rows.length);

		for(i=0;i<sBookdata.rows.length;i++){
			
			sBookPages[i] = [sBookdata.rows.item(i).folderid , sBookdata.rows.item(i).pageid, sBookdata.rows.item(i).nickname]
		
		}		
		window.pageMenuCache = sBookPages;
		callback();
		},function(error){
			
			console.error('Error while making page cache: '+error.message);
		}
	)
}
flushPageMenuCache = function(){
	window.pageMenuCache = null;
    window.sbookDDHTML = null;
}

/**
* Saving the annotations... 
*/
saveAnnotationsOnPage = function(sendResponse, params){

	overwritePageDB(params, function(data){
		console.log(data);
		//Cache need not be changed, records have been updated only
		
		sendResponse({status:'OK', message: 'Saved Annotations to Database.'})	
		} ,function(error){
			console.log(error.message);
			sendResponse({status:'BAD', message: error.message})	
		
		})
}

