import { HostMatchType, type Host } from '@/lib/host';
import { HostSettings } from '@/lib/settings';

function rot13(encrypted: string) {
	let decrypted = '';
	for (let i = 0; i < encrypted.length; i++) {
		let char = encrypted.charCodeAt(i);
		if (char >= 65 && char <= 90) {
			char = ((char - 65 + 13) % 26) + 65;
		} else if (char >= 97 && char <= 122) {
			char = ((char - 97 + 13) % 26) + 97;
		}
		decrypted += String.fromCharCode(char);
	}
	return decrypted;
}

function removeSpecialSequences(input: string) {
	return input
		.replaceAll(/@\$/g, '')
		.replaceAll(/\^\^/g, '')
		.replaceAll(/~@/g, '')
		.replaceAll(/%\?/g, '')
		.replaceAll(/\*~/g, '')
		.replaceAll(/!!/g, '')
		.replaceAll(/#&/g, '');
}

function shiftString(input: string) {
	let shifted = '';
	for (let i = 0; i < input.length; i++) {
		const char = input.charCodeAt(i);
		const shiftedChar = char - 3;
		shifted += String.fromCharCode(shiftedChar);
	}
	return shifted;
}

export default {
	name: 'Voe',
	id: 'voe',
	domains: ['voe.sx'],
	regex: [
		// voe.sx
		/(?<=window\.location\.href\s=\s')\S*(?=')/gm,
		// whatever site voe.sx redirects to
		/(?<=<script type="application\/json">).*(?=<\/script>)/m
	],

	match: async function (match: RegExpMatchArray) {
		if (window.location.host === 'voe.sx') {
			await HostSettings.addTemporaryHostDomain(this, new URL(match[0]).host);
			return null;
		} else {
			let json = match[0];
			json = JSON.parse(json);

			let deobfuscated = json[0];
			deobfuscated = rot13(deobfuscated);
			deobfuscated = removeSpecialSequences(deobfuscated);
			deobfuscated = atob(deobfuscated);
			deobfuscated = shiftString(deobfuscated);
			deobfuscated = deobfuscated.split('').reverse().join('');
			deobfuscated = atob(deobfuscated);

			const payload = JSON.parse(deobfuscated);

			return {
				type: HostMatchType.HLS,
				url: payload['source']
			};
		}
	}
} satisfies Host;
