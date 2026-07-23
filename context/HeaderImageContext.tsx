import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ImageSourcePropType } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import * as FileSystem from "expo-file-system";

import {
  fetchHeaderImages,
  setHeaderImage as saveHeaderImage,
  resetHeaderImage as clearHeaderImage,
  resetAllHeaderImages,
} from "@/hooks/queries/image";
import { HEADER_FALLBACK, type HeaderKey } from "@/constants/headerImages";

type Overrides = Partial<Record<HeaderKey, string>>;

type HeaderImageContextType = {
  /** user-chosen uris, keyed by screen. missing key = using the default */
  overrides: Overrides;
  /** what a screen should actually render */
  getSource: (key: HeaderKey) => ImageSourcePropType;
  isCustom: (key: HeaderKey) => boolean;
  setImage: (key: HeaderKey, uri: string) => Promise<void>;
  resetImage: (key: HeaderKey) => Promise<void>;
  resetAll: () => Promise<void>;
};

const isOurBanner = (uri?: string | null) => {
  const dir = FileSystem.documentDirectory;
  if (!uri || !dir || !uri.startsWith(dir)) return false;
  return (uri.split("/").pop() ?? "").startsWith("header_");
};
 
const removeBannerFile = async (uri?: string | null) => {
  if (!isOurBanner(uri)) return;
  try {
    await FileSystem.deleteAsync(uri!, { idempotent: true });
  } catch (error) {
    console.log("Could not remove old banner file:", error);
  }
};
 


const HeaderImageContext = createContext<HeaderImageContextType | undefined>(
  undefined,
);

export const HeaderImageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const db = useSQLiteContext();
  const [overrides, setOverrides] = useState<Overrides>({});

  const load = useCallback(async () => {
    const rows = await fetchHeaderImages(db);
    const next: Overrides = {};
    for (const r of rows) next[r.screenKey as HeaderKey] = r.imgUri;
    setOverrides(next);
    try {
      const dir = FileSystem.documentDirectory;
      if (!dir) return;
      const inUse = new Set(Object.values(next));
      const files = await FileSystem.readDirectoryAsync(dir);
      const orphans = files
        .filter((f) => f.startsWith("header_"))
        .map((f) => dir + f)
        .filter((uri) => !inUse.has(uri));
      await Promise.all(orphans.map((uri) => removeBannerFile(uri)));
    } catch (error) {
      console.log("Banner cleanup skipped:", error);
    }
  }, [db]);

  useEffect(() => {
    load();
  }, [load]);

  const setImage = useCallback(
    async (key: HeaderKey, uri: string) => {
      const previous = overrides[key];
      await saveHeaderImage(db, key, uri);
      setOverrides((prev) => ({ ...prev, [key]: uri }));
      if (previous && previous !== uri) await removeBannerFile(previous);
    },
    [db, overrides],
  );

  const resetImage = useCallback(
    async (key: HeaderKey) => {
      const previous = overrides[key];
      await clearHeaderImage(db, key);
      setOverrides((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
      await removeBannerFile(previous);
    },
    [db, overrides],
  );

  const resetAll = useCallback(async () => {
    const previous = Object.values(overrides);
    await resetAllHeaderImages(db);
    setOverrides({});
    await Promise.all(previous.map((uri) => removeBannerFile(uri)));
  }, [db, overrides]);

  // A stored uri wins; otherwise fall back to the bundled require().
  const getSource = useCallback(
    (key: HeaderKey): ImageSourcePropType => {
      const uri = overrides[key];
      return uri ? { uri } : HEADER_FALLBACK[key];
    },
    [overrides],
  );

  const isCustom = useCallback(
    (key: HeaderKey) => Boolean(overrides[key]),
    [overrides],
  );

  const value = useMemo(
    () => ({ overrides, getSource, isCustom, setImage, resetImage, resetAll }),
    [overrides, getSource, isCustom, setImage, resetImage, resetAll],
  );

  return (
    <HeaderImageContext.Provider value={value}>
      {children}
    </HeaderImageContext.Provider>
  );
};

export const useHeaderImages = () => {
  const ctx = useContext(HeaderImageContext);
  if (!ctx)
    throw new Error("useHeaderImages must be used inside HeaderImageProvider");
  return ctx;
};


/** Convenience for screens: `const img = useHeaderImage("budget")`. */
export const useHeaderImage = (key: HeaderKey): ImageSourcePropType =>
  useHeaderImages().getSource(key);
