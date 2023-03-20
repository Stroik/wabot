import { useState } from "react";

export default function useUniqueStringArray(initialState: string[] = []) {
  const [uniqueStrings, setUniqueStrings] = useState<string[]>(initialState);

  function addUniqueString(newString: string) {
    if (!uniqueStrings.includes(newString)) {
      setUniqueStrings([...uniqueStrings, newString]);
    } else {
      setUniqueStrings(uniqueStrings.filter((s) => s !== newString));
    }
  }

  return [uniqueStrings, addUniqueString] as const;
}
