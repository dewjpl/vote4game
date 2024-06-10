import React, { useEffect, useState } from "react";

interface Game {
	id: number;
	name: string;
	votes: number;
}

const Home: React.FC = () => {
	const [games, setGames] = useState<Game[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		// Pobieranie listy gier przy załadowaniu komponentu
		fetch("/api/games")
			.then((response) => response.json())
			.then((data) => {
				setGames(data);
				setLoading(false);
			})
			.catch((err) => {
				console.error("Failed to fetch games:", err);
				setError("Failed to load games");
				setLoading(false);
			});
	}, []);

	const vote = async (gameId: number) => {
		// Wysyłanie żądania POST do serwera w celu zagłosowania na grę
		const response = await fetch("/api/vote", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ gameId }),
		});

		if (response.ok) {
			const updatedGame = await response.json();
			// Aktualizacja stanu gier po pomyślnym głosowaniu
			setGames(
				games.map((game) =>
					game.id === gameId ? { ...game, votes: updatedGame.votes } : game
				)
			);
		} else {
			const errorResponse = await response.json();
			console.error(
				"Failed to cast vote:",
				errorResponse.error || "Unknown error"
			);
		}
	};

	if (loading) return <div>Loading games...</div>;
	if (error) return <div>{error}</div>;

	return (
		<div>
			<h1>Games List</h1>
			<ul>
				{games.map((game) => (
					<li key={game.id}>
						{game.name} - Votes: {game.votes}
						<button onClick={() => vote(game.id)}>Vote</button>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Home;
