import { appConfig } from '../config/app';

// Define skin types
export type SkinId = keyof typeof appConfig.skins;