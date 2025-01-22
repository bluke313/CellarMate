import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseAsync('CellarMateDatabase');

export const initDatabase = async () => {
    try {
        await (await db).execAsync(`
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
        console.log('Added Item: ', variety);
    } 
    catch (error) {
        console.log("Error adding item: ", error);
    }
};

export const deleteItem = async (id) => {
    try {
        await (await db).runAsync(`DELETE FROM wines WHERE id = ${id}`);
        console.log('Removed item ', id);
    }
    catch (error) {
        console.log("Error removing item: ", error);
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

export const getItemFromId = async (id, setData) => {
    try {
        const result = await (await db).getFirstAsync(`SELECT * FROM wines WHERE id = ${id}`)
        setData(result);
    }
    catch (error) {
        console.log("Error fetching item from id: ", error);
    }
};