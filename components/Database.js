import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values'

const db = SQLite.openDatabaseAsync('CellarMateDatabase');

// Directory of persistent storage for photos
export const photosDir = `${FileSystem.documentDirectory}photos`;

// Initialize the database
export const initDatabase = async () => {
    try {
        await (await db).execAsync(`
            CREATE TABLE IF NOT EXISTS wines (
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
            variety TEXT, 
            origin TEXT,
            rating INTEGER, 
            brand TEXT, 
            notes TEXT, 
            vintage INTEGER, 
            photoUri TEXT,
            date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
            `);
            // DROP TABLE IF EXISTS wines;
            // INSERT INTO wines (variety, origin, rating, brand, notes, vintage, photoUri) 
            // VALUES ('a', 'a', 1, 'a', 'a', '1', ''), ('b', 'b', 2, 'b', 'b', '2', ''), ('c', 'c', 0, 'c', 'c', '0', '');

    }
    catch (error) {
        console.log("Error initializing database: ", error);
    }
};

// Add a wine to the database. Moves the photo from temporary storage to persistent storage
export const addItem = async (wine) => {
    
    var fileNameWithFormatting = null;
    var fileName = null;
    
    if (wine.photoPath) {
        fileName = `${uuidv4()}.jpg`;
        fileNameWithFormatting = `'${fileName}'`;
    }

    try {
        await (await db).runAsync(`INSERT INTO wines (variety, origin, rating, brand, notes, vintage, photoUri) 
            VALUES (
            ${wine.variety ? `'${wine.variety}'` : `'Unknown'`}, 
            ${wine.origin ? `'${wine.origin}'` : `'Unknown'`}, 
            ${wine.rating ? wine.rating : 0}, 
            ${wine.brand ? `'${wine.brand}'` : `'Unknown'`}, 
            ${wine.notes ? `'${wine.notes}'` : `''`}, 
            ${wine.vintage ? wine.vintage : 0}, 
            ${fileNameWithFormatting});`
        );
        
        if (wine.photoPath != null) {
            await FileSystem.copyAsync({
                from: wine.photoPath,
                to: `${photosDir}/${fileName}`,
            });
        }

        console.log('Added Item: ', wine.variety);
    }
    catch (error) {
        console.log("Error adding item: ", error);
    }
};

// Delete the wine with given id from the database
export const deleteItem = async (id) => {
    try {
        const item = await (await db).getFirstAsync(`SELECT photoUri FROM wines WHERE id = ${id}`);
        await (await db).runAsync(`DELETE FROM wines WHERE id = ${id}`);

        if (item.photoUri) {
            deletePhoto(item.photoUri);
        }

        console.log('Removed item:', id);
    }
    catch (error) {
        console.log("Error removing item:", error);
    }
};

// Uses setWineList to return all wines in the database and their attributes
export const getItems = async (setWineList) => {
    try {
        const result = await (await db).getAllAsync(`
            SELECT * FROM wines
            `);
        setWineList(result);
    }
    catch (error) {
        console.log("Error fetching items: ", error);
    }
};

// Uses setData to return the wine with given id and its attributes 
export const getItemFromId = async (id, setData) => {
    try {
        const result = await (await db).getFirstAsync(`SELECT * FROM wines WHERE id = ${id}`)
        setData(result);
    }
    catch (error) {
        console.log("Error fetching item from id: ", error);
    }
};

// Deletes photo with given uri from persistent storage
export const deletePhoto = async (photoUri) => {
    try {
        const dirInfo = await FileSystem.getInfoAsync(photosDir)
        if (!dirInfo.exists) {
            console.log('Photos folder does not exist.');
            return;
        }
        const filePath = `${photosDir}/${photoUri}`;
        await FileSystem.deleteAsync(filePath);
        console.log('Deleted file:', photoUri);
    } catch (error) {
        console.error('Error deleting photos:', error);
    }
};

// Finds unused image files and deletes them from persistent storage
export const collectTrash = async () => {
    try {
        const dirInfo = await FileSystem.getInfoAsync(photosDir)
        if (!dirInfo.exists) {
            console.log('Photos folder does not exist.');
            setPhotos([]);
            return;
        }
        const files = await FileSystem.readDirectoryAsync(photosDir);
        const liveFiles = await (await db).getAllAsync('SELECT photoUri FROM wines');
        for (const file of files) {
            var inUse = false;
            for (const liveFile of liveFiles) {
                // console.log('comparing...');
                // console.log(file);
                // console.log(liveFile.photoUri);
                // console.log('============================');
                if (file == liveFile.photoUri) {
                    inUse = true;
                    // console.log('File in use:', file);
                }
            }
            if (inUse == false) {
                console.log('Collecting trash:', file);
                await FileSystem.deleteAsync(`${photosDir}/${file}`);
            }
        }
    } catch (error) {
        console.error('Error loging photos:', error);
    }
};