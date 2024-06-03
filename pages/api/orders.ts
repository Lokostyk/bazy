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
            SELECT u.username, p.name AS product_name, o.total_amount, o.status
            FROM Orders o
            JOIN Users u ON o.user_id = u.user_id
            JOIN OrderItems oi ON o.order_id = oi.order_id
            JOIN Products p ON oi.product_id = p.product_id
            WHERE 1=1
            ${body.name ? `AND (u.username LIKE '${body.name}%')` : ""}
            ${body.state ? `AND (o.status LIKE '${body.state}%')` : ""}
            AND (o.total_amount BETWEEN ${body.min} AND ${body.max})
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