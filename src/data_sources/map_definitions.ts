import { assertMapName, MapName } from './tile_data';

export type Badge = {
  icon?: string;
  label: string;
  labelKey?: string;
  class: string | string[];
};

export type MapDefinition = {
  key: MapName;
  label: string;
  labelKey?: string;
  badges: Badge[];
  patchDate: string;
  seed: string;
  tileSets: ('middle' | 'left' | 'right')[];
};

let mapDefinitions: MapDefinition[] | null = null;

export async function initMapDefinitions(): Promise<void> {
  if (mapDefinitions) return;
  const res = await fetch('/js/map_definitions.json');
  mapDefinitions = (await res.json()) as MapDefinition[];
}

export const getAllMapDefinitions = (): [mapName: MapName, definition: MapDefinition][] => {
  if (!mapDefinitions) throw new Error('mapDefinitions not initialized');
  return mapDefinitions.reduce<[MapName, MapDefinition][]>((validMaps, def) => {
    try {
      const mapName = assertMapName(def.key);
      validMaps.push([mapName, def]);
    } catch {}
    return validMaps;
  }, []);
};
