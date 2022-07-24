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
  // const game = req.body

  // const gameSchema = joi.object({
  //   name: joi.string().required(),
  //   stockTotal: joi.number().integer().min(1).required(),
  //   princePerDay: joi.number().integer().min(1).required()
  // })

  // const {error} = gameSchema.validate(game)

  // if (error){
  //   return res.sendStatus(400)
  // }

  // await connection.query(`INSERT INTO games (name, image, stockTotal, categoryId, pricePerDay) VALUES ('${game.name}')`)
  // res.status(201).send('Jogo criado com sucesso')
}