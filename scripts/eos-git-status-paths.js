export function parseGitPorcelainPaths(output) {
  const normalized = String(output ?? '').replace(/\r?\n$/, '');
  if (!normalized) return [];

  return normalized
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => {
      if (line.length < 4 || line[2] !== ' ') {
        throw new Error('Invalid Git porcelain status line.');
      }

      const path = line.slice(3);
      return path.includes(' -> ') ? path.split(' -> ')[1] : path;
    });
}

export function pathAllowed(path, allowedPaths) {
  return allowedPaths.some(
    (allowed) => path === allowed || path.startsWith(allowed + '/')
  );
}
