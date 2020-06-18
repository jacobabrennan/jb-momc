

//==============================================================================

//-- Network Actions -----------------------------
export const ACTION_LOGIN = 'login';
export const ACTION_TRANSFER = 'transfer';
export const ACTION_OCCUPANCY = 'occupancy';
// export const ACTION_OCCUPANCY_JOIN = 'occupancy join'; // Handled internally via ACTION_OCCUPANCY
export const ACTION_OCCUPANCY_LEAVE = 'occupancy leave';
export const ACTION_CONNECTION_REQUEST_INITIATE = 'connection request initiate';
export const ACTION_CONNECTION_REQUEST_RESPONSE = 'connection request response';
export const ACTION_WEBRTC_SIGNAL = 'webrtc signal';

//-- Map Metrics ---------------------------------
export const SIZE_TILE = 16;
export const MAP_KEY_DEPTH = 36; // Radix of keys in map text strings;

//-- Room Linking --------------------------------
export const ID_ROOM_START = 'start';
export const EXIT_LEFT = Symbol('Exit Left');
export const EXIT_RIGHT = Symbol('Exit Right');

//-- Directions ----------------------------------
export const NORTH = 1;
export const SOUTH = 2;
export const EAST = 4;
export const WEST = 8;

//-- Movement Flags ------------------------------
export const MOVEMENT_EMPTY = 1;
export const MOVEMENT_SOLID = 2;
export const MOVEMENT_WATER = 4;
export const MOVEMENT_FLORA = 8;

//-- Client Display ------------------------------
export const SIZE_WIDTH_DEFAULT = 16*SIZE_TILE;
export const SIZE_HEIGHT_DEFAULT = 9*SIZE_TILE;
