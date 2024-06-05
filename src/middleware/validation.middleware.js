const joi = require('joi')
const mongoose = require('mongoose')

const {Types} = mongoose

// const http = require('../folderS,F,E/S,F,E.JS')
// const {Firest,Second,Third} = require('../utils/httperespons')


const isValidObjectId = (vlue,helper)=>{
    if(Types.ObjectId.isValid(vlue)) return true
    return helper.message("invlaid objectId")
}


const validation = (schema)=>{
    return(req,res,next)=>{
        const data = {...req.body , ...req.params, ...req.query}
        const validationResult=schema.validate( data,{abortEarly:false})

        if(validationResult.error){
            const errorMessage=validationResult.error.details.map((obj)=>{
                return obj.message
            })
            return res.json(errorMessage)
        }

        return next()

    }

}

module.exports = {
    isValidObjectId,
    validation
}