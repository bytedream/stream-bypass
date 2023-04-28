function runInPageContext(to_execute: string) {
    // Adapted from: https://github.com/arikw/extension-page-context
    const doc = document;

    // test that we are running with the allow-scripts permission
    try { window.sessionStorage; } catch (ignore) { return null; }
    
    // returned value container
    const resultMessageId = parseInt('' + Math.floor((Math.random() * 100) + 1) + ((new Date()).getTime()));
    
    // prepare script container
    let scriptElm = doc.createElement('script');
    scriptElm.setAttribute("type", "application/javascript");

    const code = `
        (
            async function () {

                    const response = {
                        id: ${resultMessageId}
                    };

                    try {
                        response.result = JSON.stringify(await (${to_execute})() ); // run script
                    } catch(err) {
                        response.error = JSON.stringify(err);
                    }
            
                    window.postMessage(response, '*');
            }
        )();
    `;

    // inject the script
    scriptElm.textContent = code;

    // run the script
    doc.documentElement.appendChild(scriptElm);

    // clean up script element
    scriptElm.remove();

    // create a "flat" promise
    let resolve, reject;
    const promise = new Promise((res, rej) => { resolve = res; reject = rej; });


    // resolve on result
    function onResult(event) {
        const data = Object(event.data);
        if (data.id === resultMessageId) {
            window.removeEventListener('message', onResult);
            if (data.error !== undefined) {
                return reject(JSON.parse(data.error));
            }
            return resolve((data.result !== undefined) ? JSON.parse(data.result) : undefined);
        }
    }

    window.addEventListener('message', onResult);

	return promise;
}

export const unPack = async (packed: String): Promise<string> => {
    // Adapted from http://matthewfl.com/unPacker.html by matthew@matthewfl.com
	
	let context = `
		{
			eval: function (c) {
				packed = c;
			},
			window: {},
			document: {}
		}
	`
	
	const to_execute = `function() { let packed = ""; with(${context}) { ` + packed + '}; return packed; }'

	const res = await runInPageContext(to_execute);


	return (res+"").replace(/;/g, ";\n").replace(/{/g, "\n{\n").replace(/}/g, "\n}\n").replace(/\n;\n/g, ";\n").replace(/\n\\n/g, "\n");
}
