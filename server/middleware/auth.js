// const User = require('../models/user');
//
// const populateUser = async (req, res, next) => {
//   try {
//     const userId = req.session.userId; // Assuming you store userId in session
//     if (userId) {
//       const user = await User.findById(userId);
//       if (user) {
//         req.user = user;
//       }
//     }
//     next();
//   } catch (error) {
//     next(error);
//   }
// };
//
// const checkAdmin = (req, res, next) => {
//   if (req.user && req.user.isAdmin) {
//     next();
//   } else {
//     res.status(403).json({ message: 'Access denied' });
//   }
// };
//
// module.exports = { populateUser, checkAdmin };
