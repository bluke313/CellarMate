import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseAsync('CellarMateDatabase');

export const initDatabase = async () => {
    try {
        await (await db).execAsync(`
            DROP TABLE IF EXISTS wines;
            CREATE TABLE IF NOT EXISTS wines (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, variety TEXT, origin TEXT, rating INTEGER, brand TEXT, notes TEXT, vintage INTEGER, photoPath TEXT);
            `);
    } 
    catch (error) {
        console.log("Error initializing database: ", error);
    }
};

export const addItem = async (variety, origin, rating, brand, notes, vintage, photoPath) => {
    try {
        await (await db).runAsync(`INSERT INTO wines (variety, origin, rating, brand, notes, vintage, photoPath) VALUES ('${variety}', '${origin}', ${rating}, '${brand}', '${notes}', ${vintage}, '${photoPath}');`);
    } 
    catch (error) {
        console.log("Error adding item: ", error);
    }
};

export const getItems = async (setWineList) => {
    try {
        const result = await (await db).getAllAsync('SELECT * FROM wines;');
        setWineList(result);
    } 
    catch (error) {
        console.log("Error fetching items: ", error);
    }
}; 