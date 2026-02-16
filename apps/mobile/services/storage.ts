import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserPreferences } from '../types/preferences';

export const USER_PREFERENCES_KEY = '@sprout:preferences';

export class StorageService {
  static async savePreferences(preferences: UserPreferences): Promise<void> {
    try {
      await AsyncStorage.setItem(
        USER_PREFERENCES_KEY,
        JSON.stringify(preferences),
      );
    } catch (error) {
      console.error('Error saving preferences:', error);
      throw new Error('Failed to save preferences');
    }
  }

  static async getPreferences(): Promise<UserPreferences> {
    try {
      const json = await AsyncStorage.getItem(USER_PREFERENCES_KEY);
      return json
        ? JSON.parse(json)
        : {
            theme: 'system',
          };
    } catch (error) {
      console.error('Error getting preferences:', error);
      return {
        theme: 'system',
      };
    }
  }
}
