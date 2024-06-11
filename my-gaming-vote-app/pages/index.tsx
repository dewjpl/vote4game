import React, { useEffect, useState } from "react";

// Definicja typu dla obiektu gry
interface Game {
	id: number;
	name: string;
	votes: number;
	img_url: string; // Upewnij się, że klucz w danych API odpowiada temu kluczowi
	description: string;
}

const Home: React.FC = () => {
	const [games, setGames] = useState<Game[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [voting, setVoting] = useState<boolean>(false); // Stan do zarządzania blokowaniem głosowania

	// Funkcja do pobierania gier
	const fetchGames = async () => {
		setLoading(true); // Ustaw ładowanie na true przed fetchowaniem
		try {
			const response = await fetch("/api/games");
			if (!response.ok) {
				throw new Error("Failed to fetch games");
			}
			const data = await response.json();
			console.log("Fetched games:", data); // Logowanie otrzymanych danych
			setGames(data);
			setLoading(false);
		} catch (err) {
			console.error("Failed to fetch games:", err);
			setError("Failed to load games");
			setLoading(false);
		}
	};

	// Wywołaj fetchGames przy montowaniu komponentu
	useEffect(() => {
		fetchGames();
	}, []);

	// Funkcja do głosowania
	const vote = async (gameId: number) => {
		setVoting(true); // Blokuj głosowanie
		try {
			const response = await fetch("/api/vote", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ gameId }),
			});

			if (response.ok) {
				console.log("Vote successful, waiting 5 seconds before refreshing...");
				setTimeout(async () => {
					await fetchGames(); // Ponownie pobierz gry po 5 sekundach
					setVoting(false); // Odblokuj głosowanie po odświeżeniu danych
				}, 5000); // Opóźnij fetchowanie gier o 5 sekund
			} else {
				const errorResponse = await response.json();
				alert(errorResponse.error); // Pokaż błąd, jeśli głosowanie nieudane
				setVoting(false); // Odblokuj głosowanie w przypadku błędu
			}
		} catch (error) {
			console.error("Error casting vote:", error);
			setVoting(false); // Odblokuj głosowanie w przypadku błędu
		}
	};

	if (loading) return <div>Loading games...</div>;
	if (error) return <div>Error: {error}</div>;

	return (
		<div className="container mx-auto px-4">
			<h1 className="text-2xl font-bold text-center my-6">Games List</h1>
			{voting && (
				<div className="text-center mb-4">Refreshing data in 5 seconds...</div>
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
										className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ${
											voting ? "opacity-50 cursor-not-allowed" : ""
										}`}
										disabled={voting} // Deaktywuj przycisk podczas głosowania
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
