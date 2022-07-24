import joi from 'joi'
import connection from "../database/postgres.js"


export async function getCategories(req, res){     
  try{     

    const { rows : categories } = await connection.query('SELECT * FROM categories')
      res.send(categories) 
    
  }
  catch (error){

    res.sendStatus(error)

  }   
      
} 


export async function postCategories(req, res){
  const category = req.body
  
    const categorySchema = joi.object({
      name: joi.string().required()
    })

    const { error } = categorySchema.validate(category)
    const { rows : exist } = await connection.query('SELECT * FROM categories WHERE name = $1', [category.name])

    if (error){
      return res.sendStatus(400)
    }
    if (exist.length !== 0){
      return res.status(409).send('Esta categoria já existe!')
    }


  await connection.query(`INSERT INTO categories (name) VALUES ('${category.name}')`)
  res.status(201).send('Categoria criada com sucesso')
}