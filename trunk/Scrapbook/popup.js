/*
function initFEObject(){
	var bgwindow = chrome.extension.getBackgroundPage();
	window.bookFE = new scrapBookFrontEnd({
			placeholder:'messages',folderPlaceHolder :  'foldermenu', sbookPlaceHolder : 'sbookmenu' ,  
			dbName:bgwindow.sbookInterface.sBookInterfaceData.dbName ,dbVersion:bgwindow.sbookInterface.sBookInterfaceData.dbVersion,
			dbSize:bgwindow.sbookInterface.sBookInterfaceData.dbSize 
		});
}*/
function init(){
	
	//TO DO Disable/Enable scrap button on URL check...
	s = /^chrome:\/\/[a-zA-Z0-9]*\/.*/;
	/*chrome.tabs.getSelected(null, function(tab) {
		if(tab.url.match(s)){
			$('#scrapbutton').unbind();
		}
	});*/
	$('#sbsavepagetext').empty();
	$('#sbsavepagetext').remove();
	$('#scrapbutton').each(function(){
		$(this).hover(
			function() { $(this).addClass('sb_ui-state-hover'); }, 
			function() { $(this).removeClass('sb_ui-state-hover'); }
			)
		}
    );
	//The page name must be 
	var bgwindow = chrome.extension.getBackgroundPage();
	
	window.bookFE = new scrapBookFrontEnd({
			placeholder:'messages',folderPlaceHolder :  'foldermenu', sbookPlaceHolder : 'sbookmenu' ,  
			dbName:bgwindow.sbookInterface.sBookInterfaceData.dbName ,dbVersion:bgwindow.sbookInterface.sBookInterfaceData.dbVersion,
			dbSize:bgwindow.sbookInterface.sBookInterfaceData.dbSize 
		});
		
	bookFE.renderFolders(function(){
		bookFE.renderFullBook(function(){
				console.log('Rendered all menus...');
					$('#mcbook>div').append('<div><img id="refreshBook" title="Refresh book" src="images/refresh-icon.png" class="image-refresh-book sb_ui-corner-all  sb_ui-state-default" onclick="refreshsbook()"></div>')	
					$('#refreshBook').hover(
					function() { 
						$(this).addClass('sb_ui-state-hover'); 
					}, 
					function() { 
						$(this).removeClass('sb_ui-state-hover'); 
					}
				);

		});
	});
	
	chrome.windows.getCurrent(function setCurrWin(windowC){
		chrome.tabs.getSelected(windowC.id,function dummy(tabC){
			//Send messag to CS asking for the page name...
			chrome.tabs.sendRequest(tabC.id, {requestType:"getpageproperty", propName: "title"}, function(response){
				var CSTitle = response.data;
				var boxC = document.getElementById('PageName');
				if(CSTitle && CSTitle.toString().trim()!=''){
					console.log('Setting title from CS:'+CSTitle); 
					boxC.value  = CSTitle;
					chrome.tabs.sendRequest(tabC.id, {requestType:"getpageproperty", propName: "folderid"}, function(response){
						var fid = response.data;
						console.log("FOLDERID from CS: "+fid);
						if(fid!=null && fid!= undefined){
							window.bookFE.folderDD.setValue('f'+fid.toString());
						}
						else{
							window.bookFE.folderDD.setValue('f-1');
						}
							
					})
				}else{
					console.log('Setting title:'+tabC.title);
					boxC.value = tabC.title;
				}
			});
			
		});
	
	});
	//TODO: Render the sbook, folders and there event handlers by calling the methods on frontend module
	
	//DO CACHE Checking...
	
}
