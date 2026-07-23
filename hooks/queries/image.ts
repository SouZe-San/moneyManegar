import { type SQLiteDatabase } from "expo-sqlite";

// ── Header images ────────────────────────────────────────────
// Only user OVERRIDES live here. A missing row means "use the bundled
// default", so resetting is just a DELETE — the default is never stored.
export const fetchHeaderImages = async (db: SQLiteDatabase) => {
  try {
    return await db.getAllAsync<{ screenKey: string; imgUri: string }>(
      "SELECT screenKey, imgUri FROM HeaderImages",
    );
  } catch (error) {
    console.error("Error fetching header images: ", error);
    return [];
  }
};

export const setHeaderImage = async (
  db: SQLiteDatabase,
  screenKey: string,
  imgUri: string,
) => {
  try {
    await db.runAsync(
      "INSERT INTO HeaderImages (screenKey, imgUri) VALUES (?,?) ON CONFLICT(screenKey) DO UPDATE SET imgUri = excluded.imgUri",
      [screenKey, imgUri],
    );
  } catch (error) {
    console.error("Error saving header image: ", error);
    throw new Error("Could not save header image");
  }
};

export const resetHeaderImage = async (db: SQLiteDatabase, screenKey: string) => {
  try {
    await db.runAsync("DELETE FROM HeaderImages WHERE screenKey = ?", [
      screenKey,
    ]);
  } catch (error) {
    console.error("Error resetting header image: ", error);
  }
};

export const resetAllHeaderImages = async (db: SQLiteDatabase) => {
  try {
    await db.runAsync("DELETE FROM HeaderImages");
  } catch (error) {
    console.error("Error resetting header images: ", error);
  }
};