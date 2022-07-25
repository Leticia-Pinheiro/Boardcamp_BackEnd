import joi from 'joi'
import dayjs from 'dayjs'
import connection from "../database/postgres.js"

export async function getRentals(req, res){
    try{     
        const { customerId, gameId } = req.query

        let query = `SELECT rentals.*, customers.name AS "customerName",
        games.name AS "gameName",
        games."categoryId",
        categories.name AS "categoryName" FROM rentals
        JOIN customers
        ON customers.id = rentals."customerId"
        JOIN games
        ON games.id = rentals."gameId"
        JOIN categories
        ON games."categoryId" = categories.id`

          if (customerId && gameId) {
            query += ` WHERE (rentals."customerId" = ${customerId} AND rentals."gameId" = ${gameId})`;
          } else if (customerId) {
            query += ` WHERE rentals."customerId" = ${customerId}`;
          } else if (gameId) {
            query += ` WHERE rentals."gameId" = ${gameId}`;
          }

        const { rows : rentals } = await connection.query(query)
        const rentalsObject = rentals.map((rental) => (   
          {
            id: rental.id,
            customerId: rental.customerId,
            gameId: rental.gameId,
            rentDate: rental.rentDate,
            daysRented: rental.daysRented,
            returnDate: rental.returnDate,
            originalPrice: rental.originalPrice,
            delayFee: rental.delayFee,
            customer: {
             id: rental.customerId,
             name: rental.customerName
            },
            game: {
              id: rental.gameId,
              name: rental.gameName,
              categoryId: rental.categoryId,
              categoryName: rental.categoryName
            }
          })
        );
        res.send(rentalsObject);
        
      }
      catch (error){

        res.sendStatus(error)

      }    
} 


export async function postRentals(req, res){
    const { customerId, gameId, daysRented } = req.body
    const date = Date.now()
    const rentDate = dayjs(date).format('YYYY-MM-DD')    

      if(daysRented <= 0){
        return res.sendStatus(400)
      }

      const { rows : customerExist } = await connection.query('SELECT c.id FROM customers c WHERE c.id = $1', [customerId])
      if (customerExist.length === 0){
        return res.sendStatus(400);
      }

      const { rows : gameExist } = await connection.query('SELECT g.id FROM games g WHERE g.id = $1', [gameId])
      if (gameExist.length === 0){
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
  const { id } = req.params
  const date = Date.now()
  const returnDate = dayjs(date).format('YYYY-MM-DD')

  const { rows : rental } = await connection.query('SELECT * FROM rentals r WHERE r.id = $1', [id])
  
  const rentalReturned = rental[0].returnDate
  const daysRented = rental[0].daysRented
  const originalPrice = rental[0].originalPrice
  const rentDate = rental[0].rentDate
  const pricePerDay = originalPrice / daysRented
  const delayDays = dayjs(date).diff(rentDate, 'days')
  let delayFee = 0

    if(rental.length === 0){
      return res.sendStatus(404)
    }

    if(rentalReturned){
      return res.sendStatus(400)
    }  

    if (delayDays > daysRented) {
      delayFee = (delayDays - daysRented) * pricePerDay;
    };

  await connection.query(`UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE id = $3`,
    [returnDate, delayFee, id])    

  res.sendStatus(200);
}


export async function deleteRentals(req, res){
  const {id} = req.params

  const { rows : exist } = await connection.query('SELECT * FROM rentals WHERE id = $1', [id])
    if(exist.length === 0){
      return res.sendStatus(404)
    }

  const returnDate = exist[0].returnDate
    if (!returnDate){
      return res.sendStatus(400)
    }

  await connection.query('DELETE FROM rentals WHERE id = $1', [id])
  res.sendStatus(200)
}