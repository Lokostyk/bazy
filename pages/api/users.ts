import mysql, {FieldPacket} from 'mysql2/promise'
import { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(req:NextApiRequest, res:NextApiResponse){
    const body = JSON.parse(req.body)    
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: 13019
    });    

    try {
        const query = `
            SELECT u.username, CONCAT(u.first_name, ' ', u.last_name) AS full_name, u.email
            FROM Users u
            WHERE 1=1
            ${body.username ? `AND (u.username LIKE '${body.username}%')` : ""}
            ${body.full_name ? `AND (CONCAT(u.first_name, ' ', u.last_name) LIKE '${body.full_name}%')` : ""}
            ${body.email ? `AND (u.email LIKE '${body.email}%')` : ""}
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