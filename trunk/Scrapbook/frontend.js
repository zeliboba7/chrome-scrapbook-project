/**
 * This will be a simple middle ware to communicate to the data base and the scrapbookPopup page.
 * Its main job is to render the popup's and the folder structure of the book.
 * Improvements: Clean up code by templating using Mustache...
 * */
// I must seperate datalogic  from presentation logic...This class does the rendering of non static elements of the Sbook plugin...

function scrapBookFrontEnd(params){
	
	this.messagePlaceholder = params.placeholder//A div element id display messages from call backs
	this.folderPlaceHolder = params.folderPlaceHolder||'foldermenu';
	this.sbookPlaceHolder = params.sbookPlaceHolder||'sbookmenu';
	
	this.bookDD = null;// will hold the selected stuff in the 2 drop downs.
	this.folderDD = null;
	this.selectedFolderID = -1;//By default all folder/pages added to 
	
	/**all messages displayed **/
	this.callback = function(response){
		 var pl = '#'+	this.messagePlaceholder;//
		 $(pl).empty();
		 $(pl).append('<div class = "sb_ui-state-highlight sb_ui-corner-all">'+
								'<p><span class="sb_ui-icon sb_ui-icon-info" style="float: left; margin-right: .3em; margin-left:0.4 em;">'+
								'</span> <strong>OK: </strong></p></div>');
		 $(pl+'>div>p>strong').append(document.createTextNode(response.message))
		 $(pl).show();
		 $(pl).hide(5000);
	}
	
	/**Remember to show error code as well. Dont hide error message*/
	this.errorcallback = function(response){
		 var pl = '#'+	this.messagePlaceholder;//
		 $(pl).empty();
		 $(pl).append('<div class = "sb_ui-state-error sb_ui-corner-al">'+
								'<p><span class="sb_ui-icon sb_ui-icon-alert" style="float: left; margin-right: .3em;">'+
								'</span> <strong>Error: </strong></p></div>');
		 $(pl+'>div>p>strong').append(document.createTextNode(response.message+' :: '+response.code))
		 $(pl).show();
	}
	
	/**
	 * use this 
	 * */
	this.closeAndFocus = function(fname,fid){
		this.folderDD.setValue("f"+fid);
		this.folderDD.closeMenu();
		this.selectedFolderID = fid; 
		this.selectedFolderName = fname;
	}
	
	/*Get the folder ID and its name*/
	this.getSelectedFolder = function(){
		var  fid_label =  this.folderDD.getValue();
		var level =  fid_label[0].trim() ==""? 0 : parseInt($('li[rel='+fid_label[0]+']').attr('level'));
		var fid = fid_label[0].trim() ==""? -1 : parseInt(fid_label[0].substr(1));
		var name = fid_label[1].trim()==""? 'root' : fid_label[1].split(':').reverse()[0]
		var a = [fid, name , level]
		
		return a;
	}
	
	/*This function is to get the selected page from the drop box */
	this.getSelectedPage = function(){
		
		return this.bookDD.getValue();
		
	}
	this.refreshBookFE = function(){
		var globalWindow = chrome.extension.getBackgroundPage();
		globalWindow.folderDDHTML =null;
		globalWindow.sbookDDHTML = null;
		$('#'+this.folderPlaceHolder).empty();
		$('#'+this.sbookPlaceHolder).empty();
	}
	
	/**
	 * Call Database and render the book and folders ['Fname','FID','Level','ParentID'] 
	 * Must clean this up...
	**/
		
	this.renderFolders = function(callback){
		
		var self = this;
		$("#mcdfolders").empty();
		$("#mcdfolders").append("<input type='text' value = '' name = 'folder' id='folder' />");
		var temp = function(){
			var sortedByLevel = globalWindow.folderMenuCache;
			
			if(globalWindow.folderDDHTML){
				//innerHTML is very fast use the cached html
				
				$("#"+self.folderPlaceHolder).replaceWith(globalWindow.folderDDHTML);
				$("#folder").mcDropdown("#"+self.folderPlaceHolder); 
				self.folderDD = $("#folder").mcDropdown();
				console.log("FONUD**"+$(".mcdropdown>#folder")[0].nodeName);	
				//This is really ugly. To attach the folder icon I need to add it at a specific point in the tree which is created by the DD
				
				if($(".mcdropdown>#folder").parent().parent().find('#addfolder').length==0){
					$(".mcdropdown>#folder").parent().parent().append('<div><image id="addfolder" title= "Add new folder" src= "images/add-folder-icon.png" class="image-add-folder sb_ui-state-default sb_ui-corner-all" onClick="addFolder()"/> </div> ')
					$('#addfolder').hover(
						function() { 
							$(this).addClass('sb_ui-state-hover'); 
						}, 
						function() { 
							$(this).removeClass('sb_ui-state-hover'); 
						}
					);
				}
				//Attach event handlers
				$.each(sortedByLevel, function(key ,folderArr){
					
					$.each(folderArr, function(){//Each folder within a level
					try{
						if(this[3] == -1){
							$('#'+self.folderPlaceHolder+"> li[rel='f"+this[1]+"']").bind('click',{folderId:this[1], folderName:this[0]},window.selectedFolder);
						}
						else{
							$('#'+self.folderPlaceHolder+" li[rel='f"+this[1]+"']").bind('click',{folderId:this[1], folderName:this[0]},window.selectedFolder);
						}
							
						}catch(err){
							console.error('Error while rendering folders from cache:'+err.message);
						}
					})
				})
			   callback();
			   return;
		   }
			$('#'+self.folderPlaceHolder).empty();
			$.each(sortedByLevel, function(key ,folderArr){
				//if(key == 'level')
				$.each(folderArr, function(){//Each folder within a level
				try{
					if(this[3] == -1){
						//first level root folders
						$('#'+self.folderPlaceHolder).append("<li rel='f"+this[1]+"' folderid='"+this[1]+"' level= '"+key+"' >"+self.truncateText(this[0])+"</li>");
						$('#'+self.folderPlaceHolder+"> li[rel='f"+this[1]+"']").bind('click',{folderId:this[1], folderName:this[0]},window.selectedFolder);
					}
					else{
						//will need to apend a UL element to the parent it is being attached to
						//cant surround every item with UL only if does not have prior UL children....
						if($('#'+self.folderPlaceHolder+" li[rel='f"+this[3]+"'] > ul").length==0){
							$('#'+self.folderPlaceHolder+" li[rel='f"+this[3]+"']").append("<ul></ul>");
						}
						$('#'+self.folderPlaceHolder+" li[rel='f"+this[3]+"'] > ul").append("<li rel='f"+this[1]+"' folderid='"+this[1]+"' level= '"+key+"' >"+self.truncateText(this[0])+" </li>");
						$('#'+self.folderPlaceHolder+" li[rel='f"+this[1]+"']").bind('click',{folderId:this[1], folderName:this[0]},window.selectedFolder);
					}
				}catch(err){
					console.error('Error while rendering folders: '+err.message);
				}
					
				})
			})
			console.log('this.folderPlaceHolder::'+self.folderPlaceHolder);
			
			$("#folder").mcDropdown("#"+self.folderPlaceHolder);  
			self.folderDD = $("#folder").mcDropdown();//render the dropdowns
			//This is not copying the class attributes why?
			globalWindow.folderDDHTML = $("#"+self.folderPlaceHolder).clone()[0].outerHTML;
			
			//Render the icon and hover states
			if($(".mcdropdown>#folder").parent().parent().find('#addfolder').length==0){
				$(".mcdropdown>#folder").parent().parent().append('<div><image id="addfolder" title= "Add new folder" src= "images/add-folder-icon.png" class="image-add-folder sb_ui-state-default sb_ui-corner-all"  onClick="addFolder()" /> </div> ')
				$('#addfolder').hover(
					function() { 
						$(this).addClass('sb_ui-state-hover'); 
					}, 
					function() { 
						$(this).removeClass('sb_ui-state-hover'); 
					}
				);
			}
			console.log('Callback from folder rendering');
			callback();
		}
		//Start here...
		var globalWindow = chrome.extension.getBackgroundPage();
		
		if(!globalWindow.folderMenuCache){
			globalWindow.redoFolderMenuCache(temp);
			console.log('Ln 203 Recached folder menus'+globalWindow.folderMenuCache)
		}else{
			console.log('Ln207: Found folder cache..');
			temp();
		}
		
	}
	
	
/**
 * Render the full book.... ['Folderid','pageid','Page Name']
 * */
	this.renderFullBook = function(callback){
		
		var self = this;
		//TODO: Should replace with progress bar...
		$("#mcbook").empty();
		$("#mcbook").append("<input type='text' name='sbook' id='sbook' value='' size='30' onfocus=\"value=''\" />");
		var temp = function(){
			var sBookPages =  globalWindow.pageMenuCache;
			var sortedByLevel =  globalWindow.folderMenuCache;
			if(globalWindow.sbookDDHTML){
				try{
					
					$("#"+self.sbookPlaceHolder).replaceWith(globalWindow.sbookDDHTML);//Need to bind the event handlers as well..
					
					$("#"+self.sbookPlaceHolder+"  li[rel^='p']").each(function(){
						//Attach away!
						var pID = $(this).attr("rel").toString();
						pID = pID.substr(1,pID.length);
						if(!isNaN(pID))
							$(this).bind('click',{pageID:pID, pageName:$(this).text()},selectedPage);
						else	
							console.log('I should not be here?:: '+$(this).html());
					})
					
					
					 $("#sbook").mcDropdown("#"+self.sbookPlaceHolder); 
					 self.bookDD = $("#sbook").mcDropdown();
			 }catch(err){
				 console.error('Error in renderFullBook: '+err.message);
			 }
			   callback();
			   return;
		   }
		   
			
			
			//The menu appears with root folders in the 0th level with unique FolderID's
			//The folder ID -1 is reserved for the place holder that represents the root.
			//The idea is that visually root is selected it means we choose a folder in the top level
			$('#'+self.sbookPlaceHolder).empty();
			//TO DO: Delegate to web workers... 
			$.each(sortedByLevel, function(key ,folderArr){
				//if(key == 'level')
				$.each(folderArr, function(){//Each folder within a level
				try{
						if(this[3] == -1 && this[1]!=-1){
							//append root folders directly to the top level. Dont show the root place holder
							$('#'+self.sbookPlaceHolder).append('<li rel="'+'f'+this[1]+'" folderid="'+this[1]+'" >'+self.truncateText(this[0])+'<ul></ul></li>');
					
						}
						else if(this[3] != -1 && this[1]!=-1){
							//Note the selectors
							$('#'+self.sbookPlaceHolder+' li[rel="'+'f'+this[3]+'"] > ul').append('<li rel="'+'f'+this[1]+'" folderid="'+this[1]+'" >'+self.truncateText(this[0])+'<ul></ul></li>');
							
						}
					}catch(err){
						console.error('Error while rendereing sbook menu folders: '+err.message);
					}
					
				})
			})
			
			$.each(sBookPages, function(){
				try{
					if(this[0] == -1){//append folderId -1 pages to the 0th level Dropdown not to the placeholder root
						
						$('#'+self.sbookPlaceHolder).append("<li rel='p"+this[1]+"' pageid= '"+this[1]+"' >"+self.truncateText(this[2])+"</li>")
						$('#'+self.sbookPlaceHolder+">li[rel='p"+this[1]+"']").bind('click',{pageID:this[1], pageName:this[2]}, window.selectedPage);
						
					}else{
						$('#'+self.sbookPlaceHolder+" li[rel='f"+this[0]+"'] > ul").append("<li rel='p"+this[1]+"' pageid= '"+this[1]+"' >"+self.truncateText(this[2])+"</li>")
						$('#'+self.sbookPlaceHolder+" li[rel='p"+this[1]+"']").bind('click',{pageID:this[1], pageName:this[2]}, window.selectedPage);

					}
				}catch(err){
					console.error('Error while rendereing sbook menu pages: '+err.message);
				}
					
			})
			try{
				$("#sbook").mcDropdown("#"+self.sbookPlaceHolder);
				self.bookDD =  $("#sbook").mcDropdown();
				globalWindow.sbookDDHTML = $("#"+self.sbookPlaceHolder).clone()[0].outerHTML;
				$('#mcbook>div').append('<div><img id="refreshBook" title="Refresh book" src="images/refresh-icon.png" class="image-refresh-book sb_ui-corner-all  sb_ui-state-default" onclick="refreshsbook()"></div>')	
		
				//HTML cache...
			}catch(err){
				console.log('Error at test pt 2'+err.message)
			}
			console.log('Initiating callback after rendering the book');
			callback();
		}
		//
		var globalWindow = chrome.extension.getBackgroundPage();
		
		if(!globalWindow.folderMenuCache){
			globalWindow.redoFolderMenuCache(function(){
					//sortedByLevel = globalWindow.folderMenuCache;
					console.log('Ln 305 Recached folder menus'+globalWindow.folderMenuCache)
					if(!globalWindow.pageMenuCache){
						globalWindow.redoPageMenuCache(temp);
						console.log('Ln 308 Recached page menus'+globalWindow.pageMenuCache)
					}else{
						temp();
					}
					//sBookPages = globalWindow.pageMenuCache;
				});
			
		}else{
			console.log('Ln316: Found folder cache..');
			if(!globalWindow.pageMenuCache){
				globalWindow.redoPageMenuCache(temp);
				
			}else{
				console.log('Ln321 Found page cache..');
				temp();
			}
		}
		
		//console.log('globalWindow.sbookDDHTML::'+globalWindow.sbookDDHTML);
	}
	
	
	this.truncateText = function(text){
		if(text && text.trim()!=''){
			
			if(text.length>30){
				var a = text.toString().substring(0,30);
				return a.concat('...')
			}else{
				return text;
			}
		}else{
			return text;
		}
	}
	
	
}
