import joi from 'joi'

import connection from "../database/postgres.js"

export async function getCustomers(req, res){
    try{     

        const { rows : customers} = await connection.query('SELECT * FROM customers')
        res.send(customers)
        
      }
      catch (error){

        res.sendStatus(error)

      }    
} 


export async function getCustomerById(req, res){
    try{     
        const {id} = req.params         

        const { rows : customer } = await connection.query('SELECT * FROM customers WHERE id = $1', [id])

        if (customer.length === 0){
          return res.sendStatus(404)
        }

        res.send(customer)
        
      }
      catch (error){

        res.sendStatus(error)

      }    
} 


export async function postCustomers(req, res){
  const customer = req.body
  
    const customerSchema = joi.object({
      name: joi.string().required(),
      phone: joi.string().min(10).max(11).pattern(/^[0-9]+$/).required(),
      cpf: joi.string().pattern(new RegExp('^[0-9]{11}$')).required(),
      birthday: joi.string().length(10).pattern(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/).required()
    })

    const { error } = customerSchema.validate(customer)
    const { rows : exist } = await connection.query('SELECT * FROM customers WHERE cpf = $1', [customer.cpf])

    if (error){
      return res.sendStatus(400)
    }
    if (exist.length !== 0){
      return res.status(409).send('Cpf já cadastrado!')
    }


  await connection.query(`INSERT INTO customers (name, phone, cpf, birthday) VALUES ('${customer.name}','${customer.phone}', '${customer.cpf}', '${customer.birthday}')`)
  res.status(201).send('Cliente cadastrado com sucesso')
    
}


export async function updateCustomers(req, res){
  const customer = req.body
  const { id } = req.params
  
    const customerSchema = joi.object({
      name: joi.string().required(),
      phone: joi.string().min(10).max(11).pattern(/^[0-9]+$/).required(),
      cpf: joi.string().pattern(new RegExp('^[0-9]{11}$')).required(),
      birthday: joi.string().length(10).pattern(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/).required()
    })

    const { error } = customerSchema.validate(customer)
    const { rows : exist } = await connection.query('SELECT * FROM customers WHERE cpf = $1', [customer.cpf])

    if (error){
      return res.sendStatus(400)
    }
    if (exist.length !== 0){
      return res.status(409).send('Cpf já cadastrado!')
    }


  await connection.query(`UPDATE customers SET name = '${customer.name}', phone='${customer.phone}', cpf='${customer.cpf}', birthday='${customer.birthday}' WHERE id = ${id}`)
  res.status(200).send('Cliente atualizado com sucesso')
}