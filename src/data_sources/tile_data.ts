export type TileData = { url: string };
export type MapName = string;

type TileSourceMap = Record<string, TileData[]>;

let tileSources: TileSourceMap | null = null;

export async function initTileSources(): Promise<void> {
  if (tileSources) return;
  const res = await fetch('/js/tilesources.json');
  tileSources = (await res.json()) as TileSourceMap;
}

export const isValidMapName = (name: string | undefined): name is MapName => {
  return typeof name === 'string' && tileSources !== null && Object.prototype.hasOwnProperty.call(tileSources, name);
};
export const assertMapName = (name: string): MapName => {
  if (!isValidMapName(name)) {
    throw new Error(`无效的地图名称: '${name}'`);
  }
  return name;
};
export const asMapName = (name: string | undefined): MapName | undefined => (isValidMapName(name) ? name : undefined);

export const getTileData = (name: MapName): TileData[] => {
  if (!tileSources) throw new Error('tileSources not initialized');
  return tileSources[name];
};

export async function fetchMapVersions(mapName: MapName): Promise<Record<string, string>> {
  if (!tileSources) throw new Error('tileSources not initialized');
  const promises = tileSources[mapName].map(async ({ url }): Promise<[string, string]> => {
    const versionFile = new URL('/currentVersion.txt', url);
    let cacheBustString: string;
    try {
      const res = await fetch(versionFile);
      cacheBustString = res.status === 200 ? (await res.text()).trim() : Math.random().toString(36).slice(2);
    } catch {
      cacheBustString = Math.random().toString(36).slice(2);
    }
    return [versionFile.origin, cacheBustString];
  });
  const entries = await Promise.all(promises);
  return Object.fromEntries(entries);
}
