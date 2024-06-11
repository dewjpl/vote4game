// pages/api/vote.ts
import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../lib/db"; // Asumujemy, że db to prawidłowo skonfigurowane połączenie z bazą danych

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === "POST") {
		// Przetwarzanie parametru gameId przekazanego w body żądania
		const gameId = parseInt(req.body.gameId, 10);

		// Walidacja, czy gameId jest prawidłowym numerem
		if (isNaN(gameId)) {
			// Zwróć błąd, jeśli gameId nie jest liczbą
			return res.status(400).json({ error: "Invalid game ID provided" });
		}

		try {
			// Wykonaj zapytanie SQL aktualizujące liczbę głosów dla podanej gry
			const result = await db.query(
				"UPDATE games SET votes = votes + 1 WHERE id = $1 RETURNING *", // Usunąłem rzutowanie na integer dla spójności z typami w JavaScript
				[gameId]
			);

			// Obsługa przypadku, gdy gra o danym ID nie istnieje
			if (result.rowCount === 0) {
				return res.status(404).json({ error: "Game not found" });
			}

			// Zwróć zaktualizowany rekord gry, jeśli aktualizacja przebiegła pomyślnie
			res.status(200).json(result.rows[0]);
		} catch (error) {
			console.error("Error updating votes:", error);
			// Zwróć błąd serwera, jeśli wystąpił problem z zapytaniem do bazy danych
			res
				.status(500)
				.json({ error: "Internal server error", details: error.message });
		}
	} else {
		// Odpowiedz błędem, jeśli użyto metody inniej niż POST
		res.setHeader("Allow", ["POST"]);
		res.status(405).end("Method Not Allowed");
	}
}
