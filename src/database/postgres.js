import pkg from 'pg';

  const { Pool } = pkg;

  const connection = new Pool({
     user : 'postgres',
     password : '025811',
     host : 'localhost',
     port : 5432,
     database : 'boardcamp'
  })

  export default connection;
  
  // const user = 'postgres';
  // const password = '025811';
  // const host = 'localhost';
  // const port = 5432;
  // const database = 'boardcamp';
  
  // const connection = new Pool({
  //   connectionString: process.env.DATABASE_URL,
  // });
  
//   const query = connection.query('SELECT * FROM produtos');
//   const query = connection.query('select * from clientes where uf = $1', [uf]);
  
//   query.then(result => {
//       console.log(result.rows);
//   });


  






