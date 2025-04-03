export function lastPathSegment(path: string): string {
    return path.substring(path.lastIndexOf('/'));
}
