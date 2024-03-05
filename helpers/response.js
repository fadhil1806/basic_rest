async function response(res, status, data = null) {
    res.status(status).send(data)
} 
module.exports = response