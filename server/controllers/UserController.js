import  UserService  from '../services/UserService/UserService.js';

const userService = new UserService();

class UserController {
    constructor() { }

    createUser = async (req,res) => {
        try {
            const result = await userService.createUser(req.body);
            res.status(200).send(result);
        }
        catch (error) {
            res.status(400).send({ success: false, message: error.message })
        }
    };

    

    getAllUsers = async (req, res) => {
        try {
            const result = await userService.getAllUsers();
            res.status(200).send({ success: true, data: result });
        }
        catch (error) {
            res.status(400).send({ success: false, message: error.message })
        }
    };



    getUserById = async (req, res) => {
        try {
            const result = await userService.getUserById(req.params.id);
            res.status(200).send(result);
        }
        catch (error) {
            res.status(400).send({ success: false, message: error.message })
        }
    };



    updateUser = async (req, res) => {
        try {
            const result = await userService.updateUser(req.params.id, req.body);
            res.status(200).send(result);    
        }
        catch (error) {
            res.status(400).send({ success: false, message: error.message })
        }
    };




    deleteUser = async (req, res) => {
        try {
            const result = await userService.deleteUser(req.params.id);
            res.status(200).send({ success: true, data: result });
        }
        catch (error) {
            res.status(400).send({ success: false, message: error.message })
        }
    };


    
    login = async (req,res) => {
        try {
            const result = await userService.login(req.body);
            res.status(200).send({ success: true, data: result.data });
    
        }
        catch (error) {
            res.status(400).send({ success: false, message: error.message })
        }
    }

}

export default UserController