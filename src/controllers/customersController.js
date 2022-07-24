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

export async function getCustomerByCpf(req, res){
    try{     
        const {cpf} = req.params

        const { rows : customer} = await connection.query('SELECT * FROM customers WHERE cpf = $1', [cpf])
        res.send(customer)
        
      }
      catch (error){

        res.sendStatus(error)

      }    
} 

export async function postCustomers(req, res){
    
}