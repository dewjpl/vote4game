import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../lib/db";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === "POST") {
		const { gameId } = req.body;
		if (!gameId) {
			return res.status(400).json({ error: "Game ID is required" });
		}
		try {
			await db.query("UPDATE games SET votes = votes + 1 WHERE id = $1", [
				gameId,
			]);
			res.status(200).json({ message: "Vote counted!" });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}
}
