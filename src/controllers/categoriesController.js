import joi from 'joi'
import connection from "../database/postgres.js"

export async function getCategories(req, res){     

        const { rows : categories} = await connection.query('SELECT * FROM categories')
        res.send(categories)        
      
} 

export async function postCategories(req, res){
  const category = req.body

  const categorySchema = joi.object({
    name: joi.string().required()
  })

  const {error} = categorySchema.validate(category)

  if (error){
    return res.sendStatus(400)
  }

  await connection.query(`INSERT INTO categories (name) VALUES ('${category.name}')`)
  res.status(201).send('Categoria criada com sucesso')
}