const bcrypt = require('bcryptjs');

const helpers = {};

helpers.ecryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    // encrypt password
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

helpers.matchPassword = async (password, savePassword) => {
    try{
        return await bcrypt.compare(password, savePassword);
    }catch(e){
        // puedes enviar algun mensaje si pasa lagun error, etc
        console.log(e);
    }
};

module.exports = helpers;