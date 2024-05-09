const userService = require("../services/userService");

exports.registerUser = async (req, res) => {
    try {
      const newUser = await userService.registerUser(req.body);
      if (!newUser)
        return res.status(500).json({ error: "Could not create new user" });
      return res.json({ status: 200, user: newUser });
    } catch (error) {
      console.log("[USER]: %s\n%s", error, error.stack);
      res.status(500).json({ error: error.message });
    }
  };
  exports.longinUser = async (req, res) => {
    try {
      const User = await userService.loginUser(req.body);

      return res.json({ status: 200, data: User });
    } catch (error) {
      console.log("[USER]: %s\n%s", error, error.stack);
      res.status(500).json({ error: error.message });
    }
  };