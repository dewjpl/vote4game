const { Pool } = require("pg");

// Konfiguracja połączenia z bazą danych
const pool = new Pool({});

// Funkcja do testowania połączenia z bazą danych
async function testDatabaseConnection() {
	try {
		// Proste zapytanie SQL do bazy danych
		const res = await pool.query("SELECT NOW() as now");
		console.log(
			"Successful database connection. Current time from DB:",
			res.rows[0].now
		);
		// Zamykanie połączenia z bazą danych
		await pool.end();
	} catch (err) {
		console.error("Failed to connect to the database. Error:", err);
	}
}

// Wywołanie funkcji testowej
testDatabaseConnection();
