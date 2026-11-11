import defaultSettings from '@/../../data/defaultSettings.json';

export const getSettings = async () => await tiny.store.get('settings') || defaultSettings;