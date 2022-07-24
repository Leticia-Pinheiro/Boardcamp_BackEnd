import joi from 'joi'
import connection from "../database/postgres.js"

export async function getRentals(req, res){
    try{     

        const { rows : rentals} = await connection.query('SELECT * FROM rentals')
        res.send(rentals)
        
      }
      catch (error){

        res.sendStatus(error)

      }    
} 

export async function postRentals(req, res){
    
}