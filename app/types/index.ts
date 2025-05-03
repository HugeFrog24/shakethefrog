import { appConfig } from '../config/app';

// Define skin types
export type SkinId = keyof typeof appConfig.skins;

export type Skin = {
  id: SkinId;
  name: string;
  normal: string;
  shaken: string;
};

export type Skins = {
  [key in SkinId]: Skin;
};