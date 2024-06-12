import { NextApiRequest, NextApiResponse } from "next";
import pool from "../../lib/db";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === "GET") {
		try {
			const { rows } = await pool.query("SELECT * FROM games");
			res.status(200).json(rows);
		} catch (error) {
			console.error("Failed to fetch games:", error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	} else {
		res.setHeader("Allow", ["GET"]);
		res.status(405).end("Method Not Allowed");
	}
}
