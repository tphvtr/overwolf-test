export interface GameEvent {
  id: number;
  type: 'kill' | 'death' | 'assist';
  time: number;
  child?: GameEvent[]; // property for ui
  left?: number; // property for ui
}
