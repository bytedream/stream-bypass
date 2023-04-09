export const unPack = (packed: String): any => {
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
	
	eval(`with(${context}) { ` + packed + '}')
	
	packed = (packed+"").replace(/;/g, ";\n").replace(/{/g, "\n{\n").replace(/}/g, "\n}\n").replace(/\n;\n/g, ";\n").replace(/\n\\n/g, "\n");

	return packed
}
