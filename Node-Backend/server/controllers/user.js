const UserModel = require("../../models").Users;
const bcrypt = require("bcrypt");

const tokenLib = require("../middleware/token");
//const JWTKEY = require("../constant/index");
const JWTKEY = "DoesNotWorkWith_constant!!!";

module.exports = {

    login(req, res) {
        UserModel.findAll({
            where: {
                email: req.body.email,
            },
        }).then((users) => {
            if (users.length > 0) {
                if (bcrypt.compareSync(req.body.Mdp, users[0].password)) {

                    const userId = users[0].userId
                    const token = tokenLib.createJWT(userId, JWTKEY, "3h")

                    //          console.log(token);
                    res.setHeader("Authorization", "Bearer " + token);

                    res.status(200).json({ "token": token });

                } else {
                    res.status(403).send("ça marche bof");
                }
            } else {
                res.status(403).send("ça marche po");
            }
        });
    },
    /*
    generateJWT(user) {
        const token = jwt.sign(
            {
                _id: user.userId,
            },
            Key
        );
        console.log(token);
    }, */
    createUser(req, res) {
        let hash = bcrypt.hashSync(req.body.password, 10);
        return UserModel.create(
          {
            name:  req.body.firstName + " " + req.body.name,
            email: req.body.email,
            password: hash,
          }
          // req.body)
        )
          .then((message) => {
            // console.log('message', message)
            message.password = "##########" 
            res.status(201).send(message)
          })
          .catch((error) => res.status(400).send(error));
      },
};

