var stylefill = {

	objSize : function(obj) {
	
	    var size = 0, key;
	    
	    for (key in obj) {
	        if (obj.hasOwnProperty(key)) size++;
	    }
	    
	    return size;
	    
	},
	
	arraySliceShim : function () { // fixes Array.prototype.slice support for IE lt 9
	
		'use strict';
    var _slice = Array.prototype.slice;

    try {
        _slice.call(document.documentElement); 
    }
    catch (e) { // Fails in IE < 9
    
        Array.prototype.slice = function (begin, end) {
        
            var i, arrl = this.length, a = [];
            
            if (this.charAt) { 
            
                for (i = 0; i < arrl; i++) {
                    a.push(this.charAt(i));
                }
                
            }
            else { 
            
                for (i = 0; i < this.length; i++) { 
                    a.push(this[i]);
                }
                
            }
            
            return _slice.call(a, begin, end || a.length);
            
        };
        
    }
	
	},

	init : function (params) {
		
		this.arraySliceShim();
		
		for (property in params) {
			
			var func = params[property];	
					
			this.getStyleSheet(property, func);
		
		}
	
	},
	
	loadFile : function(url, property, func) {
	
	    var req;
	
	    if (window.XMLHttpRequest) req = new XMLHttpRequest();
	    else req = new ActiveXObject("Microsoft.XMLHTTP");
	    
	    req.open("GET", url, true);
	
	    req.onreadystatechange = function() {
	    	
	      if (this.readyState == 4 && this.status == 200) stylefill.findRules(property, this.responseText, func);
	      
	    };
	    
	    req.send(null);	
	
	},
	
	getStyleSheet : function (property, func) {
	
		var sheetstext = new Array(),
				sheets = Array.prototype.slice.call(document.getElementsByTagName('link')); // grab stylesheet links - not used yet
				
				sheets.push(Array.prototype.slice.call(document.getElementsByTagName('style'))[0]); // add on page CSS
				
		var scount = this.objSize(sheets);
		
		while (scount-- > 0) {
			
			var sheet = sheets[scount];
			
			if (sheet.innerHTML) this.findRules(property, sheet, func);
			else this.loadFile(sheet.href, property, func);
					
		}
	
	},
	
	checkRule : function (property) {
		
		var propertyCamel = property.replace(/(^|-)([a-z])/g, function (m1, m2, m3) { return m3.toUpperCase(); });
		
		if (('Webkit' + propertyCamel) in document.body.style 
		 || ('Moz' + propertyCamel) in document.body.style 
		 || ('O' + propertyCamel) in document.body.style 
		 || property in document.body.style) return true;
	
	},
	
	findRules : function (property, sheettext, func) {
		
		var rules = { support: false };
			
		if (sheettext) {
		
			var selreg = new RegExp('([^}{]+){([^}]+)?' + property.replace('-', '\\-') + '[\\s\\t]*:[\\s\\t]*([^;]+)', 'gi'), 
					selmatch,
					i = 0;
			
			if (!this.checkRule(property)) { // check if rule is valid now
			
				while (selmatch = selreg.exec(sheettext)) {
		   		
					rules['rule' + i] = {
						
						selector: selmatch[1].replace(/^([\s\n\r]+|\/\*.*?\*\/)+/, '').replace(/[\s\n\r]+$/, ''),
						property: property,
						value: selmatch[3]
						
					};
					
					i++;
				
				}
			    
			}
			else rules.support = true;
			
			func(rules);
		
		}
		
	}

};