import mapDefinitions from '../data/map_definitions.json';

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

// export const getAllMapDefinitions = (): [mapName: MapName, definition: MapDefinition][] =>
//   (mapDefinitions as MapDefinition[]).map(def => [assertMapName(def.key), def]);
// 修改 getAllMapDefinitions 函数，添加错误捕获
export const getAllMapDefinitions = (): [mapName: MapName, definition: MapDefinition][] => {
  return (mapDefinitions as MapDefinition[]).reduce<[MapName, MapDefinition][]>((validMaps, def) => {
    try {
      // 尝试校验地图名称，若无效会抛出错误
      const mapName = assertMapName(def.key);
      // 校验通过则添加到有效列表
      validMaps.push([mapName, def]);
    } catch (error) {
      // 捕获错误并跳过当前条目，同时打印警告便于调试
      console.warn(`跳过无效的地图定义: key='${def.key}'，原因:`, error);
    }
    return validMaps;
  }, []);
};
