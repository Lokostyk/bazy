import mysql, {FieldPacket} from 'mysql2/promise'
import { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(req:NextApiRequest, res:NextApiResponse){
    const body = JSON.parse(req.body)
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: Number(process.env.DB_PORT)
    });    

    try {
        const query = `
            SELECT p.name, p.name, p.price, p.stock_quantity, p.category
            FROM Products p
            WHERE 1=1
            ${body.name ? `AND (p.name LIKE '${body.name}%')` : ""}
            ${body.category ? `AND (p.category LIKE '${body.category}%')` : ""}
            AND (p.price BETWEEN ${body.min} AND ${body.max})
            LIMIT ${body.numberOfRecords}
        `
        
        const values = []
        const [results, fields] = await connection.execute(query)
        connection.destroy()
        
        res.status(200).json({results, fields})
    }catch (error){
        console.log(error)
        res.status(500).json(error)
    }

}