import { useState, useEffect } from "react";

const Home = () => {
	const [games, setGames] = useState([]);
	const [loading, setLoading] = useState(true);

	// Pobieranie gier przy załadowaniu komponentu
	useEffect(() => {
		fetch("/api/games")
			.then((response) => response.json())
			.then((data) => {
				if (data.games && Array.isArray(data.games)) {
					setGames(data.games);
				} else {
					setGames([]);
				}
				setLoading(false);
			})
			.catch((error) => {
				console.error("Failed to fetch games:", error);
				setLoading(false);
			});
	}, []);

	// Funkcja oddająca głos na grę
	const vote = async (id) => {
		const response = await fetch("/api/vote", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ gameId: id }),
		});
		if (response.ok) {
			const updatedGames = games.map((game) => {
				if (game.id === id) {
					return { ...game, votes: game.votes + 1 };
				}
				return game;
			});
			setGames(updatedGames);
		} else {
			console.error("Failed to cast vote");
		}
	};

	if (loading) {
		return <p>Loading...</p>;
	}

	return (
		<div>
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
