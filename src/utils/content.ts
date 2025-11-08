// Adapted from http://matthewfl.com/unPacker.html by matthew@matthewfl.com
export async function unpack(packed: string): Promise<string> {
	const context = `
		{
			eval: function (c) {
				packed = c;
			},
			window: {},
			document: {}
		}
	`;
	const toExecute = `
        function() {
            let packed = "";
            with(${context}) {
                ${packed}
            };
            return packed;
        }
    `;

	const res = (await runInPageContext(toExecute)) as string;
	return res
		.replace(/;/g, ';\n')
		.replace(/{/g, '\n{\n')
		.replace(/}/g, '\n}\n')
		.replace(/\n;\n/g, ';\n')
		.replace(/\n\\n/g, '\n');
}

// Adapted from: https://github.com/arikw/extension-page-context
async function runInPageContext<T>(toExecute: string): Promise<T | null> {
	// test that we are running with the allow-scripts permission
	try {
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		window.sessionStorage;
	} catch {
		return null;
	}

	// returned value container
	const resultMessageId = crypto.randomUUID();

	// prepare script container
	const scriptElm = document.createElement('script');
	scriptElm.setAttribute('type', 'application/javascript');

	// inject the script
	scriptElm.textContent = `
        (
            async function () {
				const response = {
					id: '${resultMessageId}'
				};

				try {
					response.result = JSON.stringify(await (${toExecute})() ); // run script
				} catch(err) {
					response.error = JSON.stringify(err);
				}
            
				window.postMessage(response, '*');
            }
        )();
    `;

	// run the script
	document.documentElement.appendChild(scriptElm);

	// clean up script element
	scriptElm.remove();

	let resolve: (value: T) => void;
	let reject: (value: any) => void;
	const promise = new Promise<T>((res, rej) => {
		resolve = res;
		reject = rej;
	});
	function onResult(event: MessageEvent) {
		if (event.data.id === resultMessageId) {
			window.removeEventListener('message', onResult);
			if (event.data.error !== undefined) {
				return reject(JSON.parse(event.data.error));
			}
			return resolve(event.data.result !== undefined ? JSON.parse(event.data.result) : undefined);
		}
	}

	window.addEventListener('message', onResult);

	return await promise;
}
