export interface GestureData {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

export interface Landmark {
  x: number;
  y: number;
  z: number;
}

export interface DetectionResult {
  landmarks: Landmark[][];
  handedness: { index: number; score: number; categoryName: string; displayName: string }[][];
}

export enum GestureType {
  None = "None",
  OpenHand = "Open Hand",
  ClosedFist = "Closed Fist",
  ThumbsUp = "Thumbs Up",
  ThumbsDown = "Thumbs Down",
  Victory = "Victory",
  Pointing = "Pointing",
  Love = "I Love You",
}