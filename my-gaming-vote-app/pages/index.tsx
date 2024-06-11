import React, { useEffect, useState } from "react";

interface Game {
	id: number;
	name: string;
	votes: number;
	img_url: string;
	description: string;
}

const Home: React.FC = () => {
	const [games, setGames] = useState<Game[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
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
		try {
			const response = await fetch("/api/vote", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ gameId }),
			});

			if (response.ok) {
				const updatedGame = await response.json();
				setGames(
					games.map((game) =>
						game.id === gameId ? { ...game, votes: updatedGame.votes } : game
					)
				);
			} else {
				throw new Error("Failed to cast vote");
			}
		} catch (error) {
			console.error("Error casting vote:", error);
		}
	};

	if (loading) return <div>Loading games...</div>;
	if (error) return <div>Error: {error}</div>;

	return (
		<div className="container mx-auto px-4">
			<h1 className="text-2xl font-bold text-center my-6">Games List</h1>
			<ul>
				{games.map((game) => (
					<li
						key={game.id}
						className="bg-white shadow-lg rounded-lg overflow-hidden mb-6"
					>
						<div className="md:flex">
							<img
								src={game.img_url}
								alt={game.name}
								className="w-full md:w-48 h-48 object-cover"
							/>
							<div className="p-4">
								<h2 className="font-bold text-lg mb-2">{game.name}</h2>
								<p className="text-gray-700 mb-4">{game.description}</p>
								<div className="flex justify-between items-center">
									<span className="text-sm font-semibold">
										Votes: {game.votes}
									</span>
									<button
										onClick={() => vote(game.id)}
										className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
									>
										Vote
									</button>
								</div>
							</div>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Home;
