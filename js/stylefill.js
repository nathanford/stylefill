var stylefill = {

	objSize : function(obj) {
	    var size = 0, key;
	    for (key in obj) {
	        if (obj.hasOwnProperty(key)) size++;
	    }
	    return size;
	},

	init : function (params) {
	
		var sheets = this.getStyleSheets();
		
		// need sheets.onload event for next part
		
		for (property in params) {
			
			var func = params[property];	
					
			func(this.findRules(property, sheets));
		
		}
	
	},
	
	// not used yet, need method of reading external sheet's text
	loadFile : function(url) {
	
	    var xmlhttp;
	
	    if (window.XMLHttpRequest) xmlhttp = new XMLHttpRequest();
	    else xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	
	    xmlhttp.onreadystatechange = function() {
	        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) console.log(xmlhttp.responseText);
	    }
	
	    xmlhttp.open("GET", url, true);
	    xmlhttp.send();	
	
	},
	
	getStyleSheets : function () {
	
		if (Array.prototype.slice) { // feature detect for IE lte 9
	
			var sheetstext = new Array(),
					sheets = Array.prototype.slice.call(document.getElementsByTagName('link')); // grab stylesheet links - not used yet
					
					sheets.push(Array.prototype.slice.call(document.getElementsByTagName('style'))[0]); // add on page CSS
					
			var scount = this.objSize(sheets);
			
			while (scount-- > 0) {
				
				var sheet = sheets[scount];
				
				if (sheet.innerHTML) sheetstext.push(sheet.innerHTML);
				// else loadfile(sheet.href)
						
			}
			
			return sheetstext;
		
		}
		else return false;
	
	},
	
	findRules : function (property, sheets) {
		
		var rules = new Array(),
				scount = this.objSize(sheets);
		
		while (scount-- > 0) {
		
			var sheettext = sheets[scount];
			
			if (sheettext) {
			
				var selreg = new RegExp('([^}{]+){([^}]+)?' + property.replace('-', '\\-') + '[\\s\\t]*:[\\s\\t]*([^;]+)', 'gi'),
						selmatch;
				
				while (selmatch = selreg.exec(sheettext)) {
			   
			   rules.push({
			   	
			   	selector: selmatch[1].replace(/^[\s\n\r]+/, '').replace(/[\s\n\r]+$/, ''),
			   	property: property,
			   	value: selmatch[3]
			   	
			   });
				    
				}
			
			}
		
		}
		
		return rules;
		
	}

};