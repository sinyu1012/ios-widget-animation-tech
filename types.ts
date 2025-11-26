export enum Direction {
  Horizontal = 'Horizontal',
  Vertical = 'Vertical',
}

export interface AnimationState {
  duration: number; // Seconds for full cycle
  distance: number; // Pixels
  isPlaying: boolean;
  direction: Direction;
  showMechanics: boolean;
  showTrail: boolean;
}