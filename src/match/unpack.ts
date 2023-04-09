export const unPack = (packed: String): String => {
    // Use eval() for the unPack script because else the `env` variable will not be in scope when the eval in the script is called
    const scriptlet = String.raw`
            //////////////////////////////////////////
            //  Un pack the code from the /packer/  //
            //  By matthew@matthewfl.com            //
            //  http://matthewfl.com/unPacker.html  //
            //////////////////////////////////////////
            // version 1.2
            
            
            (function (code) {
            	function indent (code) {
            		try {
            		var tabs = 0, old=-1, add='';
            		for(var i=0;i<code.length;i++) {
            			if(code[i].indexOf("{") != -1) tabs++;
            			if(code[i].indexOf("}") != -1) tabs--;
                    
            			if(old != tabs) {
            				old = tabs;
            				add = "";
            				while (old > 0) {
            					add += "\t";
            					old--;
            				}
            				old = tabs;
            			}
                    
            			code[i] = add + code[i];
            		}
            		} finally {
            			tabs = null;
            			old = null;
            			add = null;
            		}
            		return code;
            	}
                
                var env = {
                    eval: function (c) {
                        code = c;
                    },
                    window: {},
                    document: {}
                };
                
                eval("with(env) {" + code + "}");
            
            	code = (code+"").replace(/;/g, ";\n").replace(/{/g, "\n{\n").replace(/}/g, "\n}\n").replace(/\n;\n/g, ";\n").replace(/\n\\n/g, "\n");
            
                code = code.split("\n");
                code = indent(code);
                
                code = code.join("\n");
                return code;
            })(${'String.raw`'}` + packed + String.raw`${'`'})`
                 
    return eval(scriptlet);
}
