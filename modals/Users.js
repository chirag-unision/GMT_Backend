module.exports= (sequelize, DataTypes)=> {
    const Users= sequelize.define('users', {
        uid: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        username: DataTypes.STRING,
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: DataTypes.STRING
    });
    return Users;
}