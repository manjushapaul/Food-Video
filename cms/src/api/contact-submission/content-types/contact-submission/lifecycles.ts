export default {
    beforeUpdate(event) {
        throw new Error('Editing entries is not allowed');
    },
};
