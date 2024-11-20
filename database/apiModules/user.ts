const { dbQuery } = require('../db')

// 添加用户
const addUser = (user) => {
    const { phone_number } = user;
    const sql = 'INSERT INTO user (phone_number) VALUES (?)';
    dbQuery(sql, [phone_number]);
}

// 查询所有用户
const getUsers = () => {
    const sql = 'SELECT * FROM user';
    dbQuery(sql);
}

// 更新用户信息
const updateUser = (user) => {
    const { id, nickname, phone_number, register_date, signature, avatar_link } = user;
    const sql = 'UPDATE user SET nickname = ?, phone_number = ?, register_date = ?, signature = ?, avatar_link = ? WHERE id = ?';
    dbQuery(sql, [nickname, phone_number, register_date, signature, avatar_link, id]);
}

// 删除用户
const deleteUser = (id) => {
    const sql = 'DELETE FROM user WHERE id = ?';
    dbQuery(sql, [id]);
}

/** 用户数据库访问接口 */
const userDAApi = {
    addUser,
    getUsers,
    updateUser,
    deleteUser
}

export default userDAApi