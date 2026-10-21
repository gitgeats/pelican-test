export function args() {
  const o = {}; const a = process.argv.slice(2);
  for (let i = 0; i < a.length; i += 2) o[a[i].replace(/^--/, '')] = a[i + 1];
  return o;
}
