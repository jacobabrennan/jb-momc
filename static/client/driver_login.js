

//==============================================================================

//-- Dependencies --------------------------------
import { ACTION_LOGIN } from '../constants.js';
import {
    driverCreate,
    CSS_CLASS_ACTIVE,
} from './driver.js';
import { messageSend } from './network.js';

//------------------------------------------------
export default driverCreate({
    configure({ idLoginForm }) {
        this.containerId = idLoginForm;
        const formLogin = document.getElementById(idLoginForm);
        formLogin.addEventListener('submit', function (eventSubmit) {
            //
            eventSubmit.preventDefault();
            //
            const inputUsername = formLogin.elements['username'];
            const inputPassword = formLogin.elements['password'];
            const credentials = {
                username: inputUsername.value,
                password: inputPassword.value,
            };
            //
            messageSend(ACTION_LOGIN, credentials);
        });
    },
    focused() {
        const container = document.getElementById(this.containerId);
        container.classList.add(CSS_CLASS_ACTIVE);
    },
    blurred() {
        const container = document.getElementById(this.containerId);
        container.classList.remove(CSS_CLASS_ACTIVE);
    },
})
