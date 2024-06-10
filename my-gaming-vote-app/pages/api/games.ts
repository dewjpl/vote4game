import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../lib/db";

// Definicja typu dla odpowiedzi API
interface ApiResponse {
	error?: string;
	games?: any[];
	message?: string;
}

// Główny handler API
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<ApiResponse>
) {
	switch (req.method) {
		case "GET":
			await handleGetGames(req, res);
			break;
		case "POST":
			await handleVote(req, res);
			break;
		default:
			// Zwróć kod 405 dla nieobsługiwanych metod
			res.setHeader("Allow", ["GET", "POST"]);
			res.status(405).json({ error: "Method Not Allowed" });
	}
}

// Funkcja obsługująca GET - pobieranie gier
async function handleGetGames(
	req: NextApiRequest,
	res: NextApiResponse<ApiResponse>
) {
	try {
		const result = await db.query("SELECT * FROM games");
		res.status(200).json({ games: result.rows });
	} catch (error) {
		console.error("Failed to fetch games:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
}

// Funkcja obsługująca POST - głosowanie na grę
async function handleVote(
	req: NextApiRequest,
	res: NextApiResponse<ApiResponse>
) {
	const { gameId } = req.body;
	if (!gameId) {
		return res.status(400).json({ error: "Game ID is required for voting" });
	}
	try {
		await db.query("UPDATE games SET votes = votes + 1 WHERE id = $1", [
			gameId,
		]);
		res.status(200).json({ message: "Vote successful" });
	} catch (error) {
		console.error("Failed to cast vote:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
}

//
