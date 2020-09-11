'use strict'
const Database = use('Database')
const Hash = use('Hash')
const Client = use('App/Models/Client')
const ClientValidator = require("../../../service/ClientValidator")


function numberTypeParamValidator(number) {
    if (Number.isNaN(parseInt(number)))
      return { error: `param: ${number} is not supported, please use number type param instead.` }
  
    return {}
  }

class ClientController {

    async index () {
        const clients = await Client.all()
    
        return { status: 200, error: undefined, data: clients }
      }
    
      async show ({ request, auth }) {
        const { id } = request.params
    
        const validatedValue = numberTypeParamValidator(id)
    
        if (validatedValue.error)
          return { status: 500, error: validatedValue.error, data: undefined }
    
        const client = await Client.find(id)
    
        return { status: 200, error: undefined, data: client || {} }
      }
    
      async store ({ request }) {
        const { username, password, email, contact } = request.body
    
        const validatedData = await ClientValidator(request.body)
    
        if (validatedData.error)
          return { status: 422, error: validatedData.error, data: undefined }
    
        const client = await Client
          .create({ username, password, email, contact })
    
        return { status: 200, error: undefined, data: { username, password, email, contact } }
      }
    
      async update({ request }) {
        const { body, params } = request
        const { id } = params
        const { username, email, contact } = body
    
        const userId = await Database
          .table('clients')
          .where({ user_id: id })
          .update({ username, email, contact })
    
        const client = await Database
          .table('clients')
          .where({ user_id: userId })
          .first()
    
        return { status: 200, error: undefined, data: client }
      }
    
      async destroy({ request }) {
        const { id } = request.params
    
        await Database
          .table('clients')
          .where({ user_id: id })
          .delete()
    
        return { stauts: 200, error: undefined, data: { message: 'success' } }
      }

}

module.exports = ClientController
