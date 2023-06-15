const { userRepository } = require('../models/user.js')

//Creer un utilisateur ou mododifer son socketID et sharedKey si l'utilisateur existe déja
module.exports.addUserBase = async (userObject) =>{
    try{
        const findUser = await userRepository.search().where('phone').equals(userObject.phone).return.all()
        if(findUser.length > 0){
            console.log("User already exists")
            const user = await userRepository.fetch(findUser[0].entityId)
            user.socketID = userObject.socketID ?? null
            user.sharedKey = userObject.sharedKey ?? null
            await userRepository.save(user)
            return {user: user, status:201}
        }else{
            const user = await userRepository.createAndSave(userObject)
            await userRepository.createIndex()
            return {user: user, status:201}
        }
        
    }
    catch(error){
        return {error: error.message, status:409}
    }
}

//modifier les infos de l'utilisateur lors de la déconnexion
module.exports.updateUserBase = async (userId, userObject) =>{
    try{
        const findUser = await userRepository.search().where('socketID').equals(userId).return.all()
        const user = await userRepository.fetch(findUser[0].entityId)
        user.socketID = userObject.socketID ?? null
        user.sharedKey = userObject.sharedKey ?? null      
        
        await userRepository.save(user)
        return {status:201}
    }
    catch(error){
        return {error: error.message, status:409}
    }
    
}

module.exports.getUserByUserID = async(userID) => {
    try {
        const user = await userRepository.search().where('userID').equals(userID)
                  .return.all()
        return {user: user[0], status:201}
    } catch (error) {
        return {error: error.message, status:404}
    }

}

module.exports.getUserIdByPhone = async(phone) => {
    try {
        const user = await userRepository.search().where('phone').equals(phone)
                  .return.all()
        console.log("user :"+user[0].userID )
        if(user[0].userID === null){ throw new Error("User not found")}
        return {userID: user[0].userID, status:201}
    } catch (error) {
        return {error: error.message, status:404}
    }

}

module.exports.updateUserByPhone=async(phone,userObject)=>{
    try {
        const findUser = await userRepository.search().where('phone').equals(phone).return.all()
        const user = await userRepository.fetch(findUser[0].entityId)
        user.userID = userObject.userID ?? null
        user.type = userObject.type ?? null
        user.keywoord = userObject.keywoord ?? null
        user.birthday = userObject.birthday ?? null
        user.gender = userObject.gender ?? null
        user.firstName = userObject.firstName ?? null
        user.secondName = userObject.secondName ?? null
        user.isLocked = userObject.isLocked ?? null
        user.isVerified = userObject.isVerified ?? null
        
        await userRepository.save(user)
        return {status:201}
    } catch (error) {
        return {error: error.message, status:409}
    }
}