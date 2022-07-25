import joi from 'joi'
import dayjs from 'dayjs'
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
    const { customerId, gameId, daysRented } = req.body
    const date = Date.now()
    const rentDate = dayjs(date).format('YYYY-MM-DD')


    //VALIDAÇÃO -> ERROR_MESSAGE


      const { rows : exist } = await connection.query('SELECT c.id, g.id FROM customers c, games g WHERE c.id = $1 AND g.id = $2', [customerId, gameId])
      if (exist.length === 0){
        return res.sendStatus(400);
      }

    const { rows : gameInfo } = await connection.query('SELECT "pricePerDay", "stockTotal" FROM games g WHERE g.id = $1',[gameId])

    const pricePerDay = gameInfo[0].pricePerDay
    const stockTotal = gameInfo[0].stockTotal
    const originalPrice = pricePerDay * daysRented
    const returnDate = null
    const delayFee = null

      const { rows: totalGames } = await connection.query('SELECT * FROM rentals r WHERE r."gameId" = $1 AND r."returnDate" is null', [gameId])
      if (totalGames.length >= stockTotal) {
        return res.sendStatus(400);
      };  

    await connection.query(
      `INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") 
      VALUES ($1, $2, $3, $4, $5, $6, $7)`, 
      [customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee]
    )
    res.status(201).send('Aluguel cadastrado com sucesso')

}


export async function returnRentals(req, res){

}


export async function deleteRentals(req, res){

}