const userBase = require('./userBase.js')

/*create user*/
module.exports.addUser = async(req, res) =>{
    
    const {status, user, error} = await userBase.addUserBase(req.body)
    if(status === 201){
        res.status(status).json({message: user})
    }
    else{
        res.status(status).json({message: error})
    }
}

/*update user */
module.exports.updateUser=async(req, res)=>{
    console.log(req.body)
    const {status, error} = await userBase.addUserBase(req.params.id, req.body)
    if(status === 201){
        res.status(status).json({message: "User updated successfully"})
    }
    else{
        res.status(status).json({message: error})
    }
}