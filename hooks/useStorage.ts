import { type SQLiteDatabase } from "expo-sqlite";

export const migrateDbIfNeeded = async (db: SQLiteDatabase) => {
  await db.execAsync(`
        PRAGMA journal_mode = WAL;
        PRAGMA foreign_keys = ON;

        CREATE TABLE IF NOT EXISTS MemberTable (
            _id INTEGER PRIMARY KEY AUTOINCREMENT,
            userName TEXT NOT NULL UNIQUE,
            owedAmount REAL DEFAULT 0 CHECK (owedAmount >= 0), 
            dueAmount REAL DEFAULT 0 CHECK (dueAmount >= 0), 
            userId TEXT,
            imgUrl TEXT
        );

        CREATE TABLE IF NOT EXISTS GroupTable (
            _id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            logo TEXT NOT NULL,
            imgUrl TEXT
        );

        CREATE TABLE IF NOT EXISTS AllTransactions (
            _id INTEGER PRIMARY KEY AUTOINCREMENT,
            amount REAL NOT NULL CHECK (amount >= 0), 
            type TEXT NOT NULL CHECK (type IN ('income','expense')),
            expenseType TEXT DEFAULT 'Others',
            date TEXT NOT NULL,
            toWhom TEXT NOT NULL DEFAULT 'Own',
            expanseDesc TEXT NOT NULL,
            memberId INTEGER DEFAULT NULL,
            FOREIGN KEY (memberId) REFERENCES MemberTable (_id) ON DELETE SET NULL
        );

        CREATE TABLE IF NOT EXISTS UdharTransactions (
            _id INTEGER PRIMARY KEY AUTOINCREMENT,
            amount REAL NOT NULL CHECK (amount >= 0),
            type TEXT NOT NULL CHECK (type IN ('debt','owned')),
            expenseType TEXT NOT NULL,
            date TEXT NOT NULL,
            toWhom TEXT NOT NULL,
            expanseDesc TEXT NOT NULL,
            memberId INTEGER NOT NULL,
            FOREIGN KEY (memberId) REFERENCES MemberTable (_id)
        );

        CREATE TABLE IF NOT EXISTS BudgetTable (
            _id INTEGER PRIMARY KEY AUTOINCREMENT,
            amount REAL NOT NULL CHECK (amount >= 0),
            date TEXT
        );

        CREATE TABLE IF NOT EXISTS Group_Member (
            _id INTEGER PRIMARY KEY AUTOINCREMENT,
            groupId INTEGER NOT NULL,
            memberId INTEGER NOT NULL,
            FOREIGN KEY (groupId) REFERENCES GroupTable (_id) ON DELETE CASCADE,
            FOREIGN KEY (memberId) REFERENCES MemberTable (_id) ON DELETE CASCADE,
            UNIQUE(groupId, memberId)
        );

        CREATE TABLE IF NOT EXISTS CaptureInbox (
            _id INTEGER PRIMARY KEY AUTOINCREMENT,
            raw_text TEXT NOT NULL,
            source TEXT NOT NULL DEFAULT 'text' CHECK (source IN ('text','voice','image')),
            status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','processing','processed','failed')),
            parsed_json TEXT,
            created_at TEXT NOT NULL
        );

        CREATE INDEX IF NOT EXISTS idx_alltx_date ON AllTransactions(date);
        CREATE INDEX IF NOT EXISTS idx_alltx_expenseType ON AllTransactions(expenseType);
        CREATE INDEX IF NOT EXISTS idx_alltx_memberId ON AllTransactions(memberId);
        CREATE INDEX IF NOT EXISTS idx_udhar_memberId ON UdharTransactions(memberId);
        CREATE INDEX IF NOT EXISTS idx_udhar_date ON UdharTransactions(date);
    `);
};
