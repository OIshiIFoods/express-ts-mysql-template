const jwt = require('jsonwebtoken')
const { getPrivateKey } = require('./key')

const getToken = (id: number, phone_number: string) => {
    return jwt.sign({
        userId: '' + id,
        phone_number,
        exp: ~~((Date.now() / 1000) + 24 * 3600 * 3)
    }, getPrivateKey(), {
        algorithm: 'RS256'
    })
}

export default getToken