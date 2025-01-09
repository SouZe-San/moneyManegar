import { type SQLiteDatabase } from "expo-sqlite";

// const transactionStatement = db.prepareSync(
//   "INSERT INTO AllTransactions ( amount,type,expanseType,date,expanseDesc,memberId,toWhom) VALUES ($amount, $type, $expanseType, $date, $expanseDesc, $memberId, $toWhom)"
// );
// export const UdharTransactions = db.prepareSync(
//   "INSERT INTO UdharTransactions (amount,type ,expenseType ,date ,toWhom ,expanseDesc ,memberId ) VALUES ($amount,$type ,$expenseType ,$date ,$toWhom ,$expanseDesc ,$memberId )"
// );

// export const memberStatement = db.prepareSync("INSERT INTO MemberTable (name) VALUES ($name)");

// export const groupStatement = db.prepareSync(
//   "INSERT INTO GroupTable (name,logo) VALUES ($name, $logo)"
// );
// export const groupMemberStatement = db.prepareSync(
//   "INSERT INTO Group_Member (groupId, memberId) VALUES ($groupId, $memberId)"
// );

export const migrateDbIfNeeded = async (db: SQLiteDatabase) => {
  await db.execAsync(`
        PRAGMA journal_mode = WAL;
        PRAGMA foreign_keys = ON;
        
       CREATE TABLE IF NOT EXISTS AllTransactions (
            _id INTEGER PRIMARY KEY AUTOINCREMENT,
            amount REAL NOT NULL CHECK (amount >= 0), 
            type TEXT NOT NULL,
            expenseType TEXT DEFAULT 'Others',
            date TEXT NOT NULL,
            toWhom TEXT NOT NULL DEFAULT 'Own',
            expanseDesc TEXT NOT NULL,
            memberId TEXT
        );

        CREATE TABLE IF NOT EXISTS UdharTransactions (
            _id INTEGER PRIMARY KEY AUTOINCREMENT,
            amount REAL NOT NULL CHECK (amount >= 0),
            type TEXT NOT NULL,
            expenseType TEXT NOT NULL,
            date TEXT NOT NULL,
            toWhom TEXT NOT NULL,
            expanseDesc TEXT NOT NULL,
            memberId TEXT
        );

        CREATE TABLE IF NOT EXISTS GroupTable (
            _id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            logo TEXT NOT NULL
        );


        CREATE TABLE IF NOT EXISTS MemberTable (
            _id INTEGER PRIMARY KEY AUTOINCREMENT,
            userName TEXT NOT NULL UNIQUE,
            ownedAmount REAL DEFAULT 0 CHECK (ownedAmount >= 0), 
            dueAmount REAL DEFAULT 0 CHECK (dueAmount >= 0), 
            userId TEXT
        );

        CREATE TABLE IF NOT EXISTS Group_Member (
            _id INTEGER PRIMARY KEY AUTOINCREMENT,
            groupId INTEGER NOT NULL,
            memberId INTEGER NOT NULL,
            FOREIGN KEY (groupId) REFERENCES GroupTable (_id),
            FOREIGN KEY (memberId) REFERENCES MemberTable (_id)
        );

        `);
};
