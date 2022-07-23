import joi from 'joi'
import connection from "../database/postgres.js"

export async function getCategories(req, res){
    try{     

        const { rows : categories} = await connection.query('SELECT * FROM categories')
        res.send(categories)
        
      }
      catch (error){

        res.sendStatus(error)

      }    
} 

export async function postCategories(req, res){
  const categorie = req.body

  const categorieSchema = joi.object({
    name: joi.string().required()
  })

  const error = categorieSchema.validate(newCategorie)

  if (error){
    return res.sendStatus(400)
  }

  // outra aula
  // const newCategorie = await connection.query('INSERT INTO categories (name) VALUES ')
}