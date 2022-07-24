import joi from 'joi'
import connection from "../database/postgres.js"

export async function getGames(req, res){
    try{     

        const { rows : games} = await connection.query('SELECT * FROM games')
        res.send(games)
        
      }
      catch (error){

        res.sendStatus(error)

      }    
} 

export async function postGames(req, res){
    
}