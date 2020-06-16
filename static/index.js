

//==============================================================================

//-- Dependencies --------------------------------
import client from './client/index.js';

//-- Constants -----------------------------------
const ID_GAME_AREA = 'game_area';
const ID_LOGIN_FORM = 'login_form';
const ADDRESS_CONNECTION = 'ws://localhost:7231/data';

//------------------------------------------------
const configuration = {
    idGameArea: ID_GAME_AREA,
    idLoginForm: ID_LOGIN_FORM,
    addressConnection: ADDRESS_CONNECTION,
};
client.setup(configuration);
