

//==============================================================================

//------------------------------------------------
export default {
    iterate() {},
    display() {},
}

//------------------------------------------------
export function driverCreate(model) {
    return Object.assign(Object.create(model));
}
