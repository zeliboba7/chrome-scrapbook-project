
/**UI for the new note**/
function Note()
{
    var self = this;
	this.doc = document;//$('#sbinnerframe')[0].contentDocument;
    var note = this.doc.createElement('div');
    
    $(note).attr('id','sbnotes5832');
    //note.className = 'note';
    //$(note).addClass("ui-widget-content ui-draggable");
    note.addEventListener('mousedown', function(e) { return self.onMouseDown(e) }, false);
    note.addEventListener('click', function() { return self.onNoteClick() }, false);
    this.note = note;

    var close = this.doc.createElement('div');    
    //close.className = 'closebutton';
    close.addEventListener('click', function(event) { return self.close(event) }, false);
    note.appendChild(close);

    var edit = this.doc.createElement('div');
    //edit.className = 'edit';
    edit.setAttribute('contenteditable', true);
    edit.addEventListener('keyup', function() { return self.onKeyUp() }, false);
    note.appendChild(edit);
    this.editField = edit;

    var ts = this.doc.createElement('div');
    //ts.className = 'timestamp';
    ts.addEventListener('mousedown', function(e) { return self.onMouseDown(e) }, false);
    note.appendChild(ts);
    this.lastModified = ts;

    this.doc.body.appendChild(note);
    
	$(note).css('display','block')
	$(note).addClass('hover');
	
	$(note).attr('style',
		'background-color: rgb(255, 240, 70);'+
		'height: 250px;'+
		'padding: 10px;'+
		'position: absolute;'+
		'width: 200px;'+
		'-webkit-box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.5);'
	)
	$(close).css('display','block')
	const png_image_src = 'data:image/png;base64, '+'iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAABkWlDQ1BJQ0MgUHJvZmlsZQAAeJyVkT1LHFEUhp87SCwS1gSnUotrJ7obFkWwSKNTLJIUy6Kyu93szLgujLOXO9evIm2aCJp0gSD6D2wShEDQOrESt0yTxlIEtVAYi5uwjSK'
	/*.note:hover .closebutton {
		display: block;
	}*/
				
	$(close).attr('style',
		'display: block;'+
		'background-image :url(http://webkit.org/demos/sticky-notes/deleteButton.png);'+
		//'background-image: url('+png_image_src+');'+
		'height: 30px;'+
		'position: absolute;'+
		'left: -15px;'+
		'top: -15px;'+
		'width: 30px;'
	)
		
	/*$(close).hover(
		function(){
			$(this).css("display","block")
		},function(){
			$(this).css("display","none")
		}
	)
	/*$(close)
	.closebutton:active {
		background-image: url(deleteButtonPressed.png);
	}*/
	$(edit).css('outline','none')
	$(ts).attr('style',
		'position: absolute;'+
		'left: 0px;'+
		'right: 0px;'+
		'bottom: 0px;'+
		'font-size: 9px;'+
		'background-color: #db0;'+
		'color: white;'+
		'border-top: 1px solid #a80;'+
		'padding: 2px 4px;'+
		'text-align: right;'

	)

	
    
    return this;
}
/**
 * Very low level control of the widget. 
 * Needed for easy 
 * */
Note.prototype = {
    get id()
    {
        if (!("_id" in this))
            this._id = 0;
        return this._id;
    },

    set id(x)
    {
        this._id = x;
    },
	get type(){
		return this._type;
	},
	set type(t){
		this._type = t;
	},
    get text()
    {
        return this.editField.innerHTML;
    },

    set text(x)
    {
        this.editField.innerHTML = x;
    },

    get timestamp()
    {
        if (!("_timestamp" in this))
            this._timestamp = 0;
        return this._timestamp;
    },

    set timestamp(x)
    {
        if (this._timestamp == x)
            return;

        this._timestamp = x;
        var date = new Date();
        date.setTime(parseFloat(x));
        this.lastModified.textContent = modifiedString(date);
    },

    get left()
    {
        return this.note.style.left;
    },

    set left(x)
    {
        this.note.style.left = x;
    },
	get width()
	{
		return this.note.style.width;
	},
	set width(x)
	{
		this.note.style.width = x;
	},
	get height()
	{
		return this.note.style.height;
	},
	set height(x)
	{
		this.note.style.height = x;
	},
    get top()
    {
        return this.note.style.top;
    },

    set top(x)
    {
        this.note.style.top = x;
    },

    get zIndex()
    {
        return this.note.style.zIndex;
    },

    set zIndex(x)
    {
        this.note.style.zIndex = x;
    },
	
    close: function(event)
    {
        //this.cancelPendingSave();

        var note = this;
        
        
        var duration = event.shiftKey ? 2 : .25;
        this.note.style.webkitTransition = '-webkit-transform ' + duration + 's ease-in, opacity ' + duration + 's ease-in';
        this.note.offsetTop; // Force style recalc
        this.note.style.webkitTransformOrigin = "0 0";
        this.note.style.webkitTransform = 'skew(30deg, 0deg) scale(0)';
        this.note.style.opacity = '0';

        var self = this;
        window.notes.remove(this.id);
        setTimeout(function() { document.body.removeChild(self.note) }, duration * 1000);
    },
	// This saves it on the db as soon as we write...
	// 
    /*saveSoon: function()
    {
        this.cancelPendingSave();
        var self = this;
        this._saveTimer = setTimeout(function() { self.save() }, 200);
    },

    cancelPendingSave: function()
    {
        if (!("_saveTimer" in this))
            return;
        clearTimeout(this._saveTimer);
        delete this._saveTimer;
    },

    save: function()
    {
        this.cancelPendingSave();

        if ("dirty" in this) {
            this.timestamp = new Date().getTime();
            delete this.dirty;
        }
		
        var note = this;
        console.log(note.text, note.timestamp, note.left, note.top, note.zIndex, note.id, notes.type);
    },*/
	

    onMouseDown: function(e)
    {
        captured = this;
        this.startX = e.clientX - this.note.offsetLeft;
        this.startY = e.clientY - this.note.offsetTop;
        this.zIndex = ++window.notes.highestZ;

        var self = this;
        if (!("mouseMoveHandler" in this)) {
            this.mouseMoveHandler = function(e) { return self.onMouseMove(e) }
            this.mouseUpHandler = function(e) { return self.onMouseUp(e) }
        }

        this.doc.addEventListener('mousemove', this.mouseMoveHandler, true);
        this.doc.addEventListener('mouseup', this.mouseUpHandler, true);

        return false;
    },

    onMouseMove: function(e)
    {
        if (this != captured)
            return true;

        this.left = e.clientX - this.startX + 'px';
        this.top = e.clientY - this.startY + 'px';
        return false;
    },

    onMouseUp: function(e)
    {
        this.doc.removeEventListener('mousemove', this.mouseMoveHandler, true);
        this.doc.removeEventListener('mouseup', this.mouseUpHandler, true);

        //window.saveSBSoon()
        return false;
    },

    onNoteClick: function(e)
    {
        this.editField.focus();
        getSelection().collapseToEnd();
    },

    onKeyUp: function()
    {
        this.dirty = true;
        //window.saveSBSoon();
    },
}
function modifiedString(date)
{
    return 'Last Modified: ' + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
}

//Main class responsible for creating notes/handling there deletion/ recreating them from DB 
function sbnotes(){
	//increment this by 
	this.highestId =0;
	this.captured = null;
	this.highestZ =25;
	
	/*Math.max.apply(null,$.map($('body > *'), function(e,n){
		if($(e).css('position')=='absolute')
			return parseInt($(e).css('z-index'))||1 ;
		})
	);*/
	this.noteArr = {};
	/**
	 * old notes
	 * */
	this.recreateNotes = function(notes){
		this.doc = document;//$('#sbinnerframe')[0].contentDocument;
		//pass in the result set from the DB
		try{
			for (var i = 0; i < notes.length; ++i) {
				var row = notes[i];
				var note = new Note();//recreate the notes....
				//With the position and the location :) This is really good.... All i have to do is index the db with page id...
				note.id = this.highestId++;
				
				note.text = row['note'];
				note.timestamp = row['timestamp'];
				note.left = row['left'];
				note.top = row['top'];
				note.zIndex = row['zindex'];
				note.type = row['type'];
				note.width = row['width'];
				note.height = row['height'];
				this.highestZ = Math.max(this.highestZ, row['zindex']);
				
				this.noteArr[note.id] =  {id : note.id, Note: note};
				///this.noteArr.push(note);//save all the notes
				
			}	
			console.log('Created '+notes.length+' notes');
			
			}catch(e){
				
			}
		//TO DO Send message to CS that notes are created
	}
	/**
	 * New note... Need to create a note on the page and send the data to 
	 * the extension about the new note...
	 * */
	this.createNewNote = function(){
		try{
			var note = new Note();//has an ID 
			note.id = this.highestId++;
			note.timestamp = new Date().getTime();
			note.left = Math.round(Math.random() * 400) + 'px';
			note.top = (this.doc.body.scrollTop+10).toString() + 'px';
			note.zIndex = ++this.highestZ;
			note.type = 'text';
			this.noteArr[note.id] = {id : note.id, Note: note};
			
			
			return({status: 'OK', data :note, message: 'Created new note'})
		}catch(e){
			return({status: 'BAD', data :null, message: e.message})
		}
		//TO DO Send message to Extension that new note is create
	}
	/**
	 * Called when there is a request to save the notes.
	 * */
	this.getNotes = function(){
		var ret = {};
		for(i in this.noteArr){
			if(this.noteArr[i]){
				if(this.noteArr[i].Note.text.trim()!='')
					ret[i] = {id : this.noteArr[i].Note.id, type:this.noteArr[i].Note.type , text: this.noteArr[i].Note.text, timestamp: this.noteArr[i].Note.timestamp, left: this.noteArr[i].Note.left, top: this.noteArr[i].Note.top, zIndex: this.noteArr[i].Note.zIndex, width: this.noteArr[i].Note.width, height: this.noteArr[i].Note.height};
			
				console.log(this.noteArr[i]);
			}
				
		}
		return ret;
	}
	this.remove = function(id){
		this.noteArr[id] = null;
		
	}
}
