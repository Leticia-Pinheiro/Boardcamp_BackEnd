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
  const game = req.body

    const gameSchema = joi.object({
      name: joi.string().required(),
      image: joi.string().required(),
      stockTotal: joi.number().integer().min(1).required(),
      categoryId: joi.number().integer().min(1).required(),
      pricePerDay: joi.number().integer().min(1).required()
    })

    const {error} = gameSchema.validate(game)
    const { rows : exist } = await connection.query('SELECT * FROM categories WHERE id = $1', [game.categoryId])

    if (error || exist.length === 0){
      return res.sendStatus(400)
    }

    const { rows : existGame } = await connection.query('SELECT * FROM games WHERE name = $1', [game.name])
    if(existGame.length !== 0){
      return res.status(409).send("Jogo já cadastrado!")
    }

  await connection.query(`INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ('${game.name}', '${game.image}', '${game.stockTotal}', '${game.categoryId}', '${game.pricePerDay}')`)
  res.status(201).send('Jogo cadastrado com sucesso')
}