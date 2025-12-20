import Constants from 'expo-constants';

export const URL_API = Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL || process.env.EXPO_PUBLIC_API_URL || 'https://todo-list.dobleb.cl';
export const CLAVE_TOKEN = '@token_autenticacion';
