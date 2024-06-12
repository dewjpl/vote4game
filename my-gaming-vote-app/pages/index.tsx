import React, { useEffect, useState } from "react";

interface Game {
	id: number;
	title: string;
	votes: number;
	img_url: string;
	description: string;
}

const Home: React.FC = () => {
	const [games, setGames] = useState<Game[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [voting, setVoting] = useState<boolean>(false);

	const fetchGames = async () => {
		setLoading(true);
		try {
			const response = await fetch("/api/games");
			if (!response.ok) {
				throw new Error("Failed to fetch games");
			}
			const data = await response.json();
			console.log("Fetched games:", data);
			setGames(data);
			setLoading(false);
		} catch (err) {
			console.error("Failed to fetch games:", err);
			setError("Failed to load games");
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchGames();
	}, []);

	const vote = async (gameId: number) => {
		if (!voting) {
			setVoting(true);
			try {
				const response = await fetch("/api/vote", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ gameId }),
				});

				if (response.ok) {
					console.log("Vote successful, updating votes locally...");
					setGames(
						games.map((game) =>
							game.id === gameId ? { ...game, votes: game.votes + 1 } : game
						)
					);
					setTimeout(() => {
						setVoting(false);
					}, 5000);
				} else {
					const errorResponse = await response.json();
					alert(errorResponse.error);
					setVoting(false);
				}
			} catch (error) {
				console.error("Error casting vote:", error);
				setVoting(false);
			}
		}
	};

	if (loading) return <div>Ładowanie gier</div>;
	if (error) return <div>Error: {error}</div>;

	return (
		<div className="container mx-auto px-4">
			<h1 className="text-3xl font-bold text-center my-10 text-purple-400">
				Zagłosuj na swoją ulubioną grę.
			</h1>
			{voting && (
				<div className="text-center mb-4 font-bold">
					Zagłosowałeś, za 5 sekund może głosować następna osoba.
				</div>
			)}
			<ul>
				{games.map((game) => (
					<li
						key={game.id}
						className="bg-white shadow-lg rounded-lg overflow-hidden mb-6"
					>
						<div className="md:flex">
							<img
								src={game.img_url}
								alt={game.title}
								className="w-full md:w-48 h-48 object-cover"
							/>
							<div className="p-4">
								<h2 className="font-bold text-lg mb-2">{game.title}</h2>
								<p className="text-gray-700 mb-4">{game.description}</p>
								<div className="flex justify-between items-center">
									<span className="text-sm font-semibold">
										Votes: {game.votes}
									</span>
									<button
										onClick={() => vote(game.id)}
										className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ${
											voting
												? "opacity-50 cursor-not-allowed"
												: "hover:cursor-pointer"
										}`}
										disabled={voting}
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
