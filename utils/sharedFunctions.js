export const resSuccess = (data = {}, msg = "") => {
    return { data, msg };
};

export const resError = (msg = "") => {
    return { msg };
};

export const resBadRequest = (msg = "") => {
    return { msg };
};
