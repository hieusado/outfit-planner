import AsyncStorage from '@react-native-async-storage/async-storage';

import { Outfit } from './mockData';

const STORAGE_KEY = 'outfit-planner:outfits';

export async function loadOutfits(): Promise<Outfit[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    return JSON.parse(raw) as Outfit[];
  } catch (error) {
    return [];
  }
}

export async function saveOutfits(outfits: Outfit[]) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(outfits));
}
