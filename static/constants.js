

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
