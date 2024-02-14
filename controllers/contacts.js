const mailService = require('../service/mail')

const sendMessage = async (req, res) => {
    try {
        const { email, message } = req.body
      
        await mailService.sendContactsEmail(email, message)
        return res.json({status: 'ok'})
    } catch(e){
        return res.status(400).json({error: 'ok'})
    }
} 

module.exports = {
    sendMessage
}