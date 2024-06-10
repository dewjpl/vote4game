// pages/api/vote.ts
import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../lib/db";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === "POST") {
		// Przyjmujemy, że gameId może być przekazane jako string i rzutujemy na integer
		const gameId = parseInt(req.body.gameId, 10);

		// Walidacja poprawności gameId
		if (isNaN(gameId)) {
			return res.status(400).json({ error: "Invalid game ID provided" });
		}

		try {
			// Użyj jawnego rzutowania w zapytaniu SQL, jeśli to konieczne
			const result = await db.query(
				"UPDATE games SET votes = votes + 1 WHERE id = $1::integer RETURNING *",
				[gameId]
			);
			if (result.rowCount === 0) {
				return res.status(404).json({ error: "Game not found" });
			}
			res.status(200).json(result.rows[0]);
		} catch (error) {
			console.error("Error updating votes:", error);
			res
				.status(500)
				.json({ error: "Internal server error", details: error.message });
		}
	} else {
		res.setHeader("Allow", ["POST"]);
		res.status(405).end("Method Not Allowed");
	}
}
