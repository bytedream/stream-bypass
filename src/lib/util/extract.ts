export function lastPathSegment(path: string): string {
	while (path.endsWith('/')) {
		path = path.slice(0, -1);
	}
	return path.substring(path.lastIndexOf('/') + 1);
}
