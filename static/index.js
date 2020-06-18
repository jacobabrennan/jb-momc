

//==============================================================================

//-- Dependencies --------------------------------
import client from './client/index.js';

//-- Constants -----------------------------------
const ID_GAME_AREA = 'game_area';
const ID_LOGIN_FORM = 'login_form';
const ADDRESS_CONNECTION = 'wss://jb-momc.herokuapp.com/data';

//------------------------------------------------
const configuration = {
    idGameArea: ID_GAME_AREA,
    idLoginForm: ID_LOGIN_FORM,
    addressConnection: ADDRESS_CONNECTION,
};
client.setup(configuration);
