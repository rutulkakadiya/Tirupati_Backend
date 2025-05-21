const UserModel = require('../model/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports.register = async (req, res) => {
  // const { username, password, email } = req.body;
  // const data = {username, password, email};
  // return res.json(200)({
  //   data: {item: data},
  //   msg: "User registered."
  // })

  try {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ msg: 'All fields are required' });
    }

    // Check if user already exists
    // const existingUser = await UserModel.findOne({
    //   where: {
    //     [UserModel.sequelize.Op.or]: [{ username }, { email }]
    //   }
    // });

    // if (existingUser) {
    //   return resError({ res, msg: 'User already exists' });
    // }

    const hashedPassword = await bcrypt.hash(password, 10);
    const count = await UserModel.count();
    const isAdmin = count === 0;

    const newUser = await UserModel.create({
      username,
      email,
      password: hashedPassword,
      is_admin: isAdmin
    });

    const message = isAdmin ? "Admin registered successfully." : "User registered successfully.";

    return res.status(200).json({
      data: { item: newUser },
      msg: `${message}`
    });

  } catch (error) {

    console.error('Registration error:', error);
    return res.status(400).json({
      msg: `${error}`
    });
  }
};



module.exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await UserModel.findOne({ where: { username } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    };

    const token = jwt.sign(
      { id: user.id, username: user.username, isAdmin: user.is_admin },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const loggedUser = {
      id: user.id,
      username: user.username,
      isAdmin: user.is_admin,
      auth_token: token
    };

    return res.status(200).json({
      data: { item: loggedUser },
      msg: "Login Successful."
    })
  } catch (error) {
    console.error('Login error:', error);

    return res.status(500).json({
      msg: `error ${error}`
    })
  }
};

module.exports.getUsers = async (req, res) => {
  try {
    const users = await UserModel.findAll({
      attributes: ['id', 'username', 'email', ['is_admin', 'isAdmin'], 'created_at'],
    });

    return res.status(200).json({
      data: { item: users },
      msg: "user data get successfully"
    })

  } catch (error) {
    console.error('Fetching users error:', error);
    res.status(500).json({ error });
  }
};