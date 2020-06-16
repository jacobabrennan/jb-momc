

//==============================================================================

//-- Constants -----------------------------------
export const CSS_CLASS_ACTIVE = 'active';

//------------------------------------------------
export const driver = {
    configure(configuration) {},
    focused() {},
    blurred() {},
    iterate() {},
    display() {},
}

//------------------------------------------------
export function driverCreate(model) {
    return Object.assign(Object.create(driver), model);
}
