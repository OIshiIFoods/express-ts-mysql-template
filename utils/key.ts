const NodeRSA = require('node-rsa');
const path = require('path')
const fs = require('fs')

const CER_PATH = path.join(__dirname, '../auth')

//创建秘钥
function generateKeys() {
    //实例化 b 秘钥位 bit 越大越安全 256 , 512, 1024 - 4096
    // 可以了，目前可能NodeRSA最新对这个加密的b安全要求，所以取2048比较好
    const newkey = new NodeRSA({ b: 2048 });

    //设置秘钥模式
    newkey.setOptions({ encryptionScheme: 'pkcs1' })

    //设置公钥
    let public_key = newkey.exportKey('public')//公钥,

    //设置私钥
    let private_key = newkey.exportKey('private') //私钥

    //写入公钥 私钥 cer文件
    console.log(path.join(CER_PATH, 'private.cer'))
    fs.writeFileSync(path.join(CER_PATH, 'private.cer'), private_key);
    fs.writeFileSync(path.join(CER_PATH, 'public.cer'), public_key);
}

//加密
function encrypt(plain) {
    //读取秘钥 公钥
    let public_key = fs.readFileSync(path.join(CER_PATH, 'public.cer'), 'utf8');

    const nodersa = new NodeRSA(public_key);

    //设置秘钥 scheme
    nodersa.setOptions({ environment: 'browser', encryptionScheme: 'pkcs1' });

    //调用加密方法  plain是需要加密的明文 后面是要加密生成的格式
    const encrypted = nodersa.encrypt(plain, 'base64');
    return encrypted;
}

//解密
function decrypt(cipher) {
    // 获取私钥
    let private_key = fs.readFileSync(path.join(CER_PATH, 'private.cer'), 'utf8');

    //私钥实例化 NodeRSA
    let prikey = new NodeRSA(private_key);

    //设置 模式 scheme pkcs1
    prikey.setOptions({ environment: 'browser', encryptionScheme: 'pkcs1' });

    // decrypt(解密密文, 解密后格式)
    const decrypted = prikey.decrypt(cipher, 'utf8')
    return decrypted
}

function getPublicKey() {
    return fs.readFileSync(path.join(CER_PATH, 'public.cer'));
}

function getPrivateKey() {
    return fs.readFileSync(path.join(CER_PATH, 'private.cer'));
}


export {
    generateKeys, encrypt, decrypt, getPublicKey, getPrivateKey
}


// generateKeys()