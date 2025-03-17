export const authen = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    // if (!token || !user) {
    //     console.log('No token or user found');
    //     return false;
    // }

    if (token) {
        return { isAuthen: true, token, user };
    }
    return { isAuthen: false };
}