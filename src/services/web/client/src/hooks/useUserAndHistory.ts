import { useState, useEffect } from 'react';

const userInfoKey = '__chaty_user';
const historyKey = '__chaty_history';

type User = string | null;

function safeLocalStorage(): Storage | null {
  try {
    return localStorage;
  } catch (error) {
    console.warn(`Failed to access local storage: ${error}`);
    return null;
  }
}

function safeParsing(value: string | null | undefined): any {
  try {
    return value === null || value === undefined ? null : JSON.parse(value);
  } catch (error) {
    console.warn(`Failed to parse the given value: ${error}`);
    return null;
  }
}

function safeStringify(value: any): string | null {
  try {
    return JSON.stringify(value);
  } catch (error) {
    console.warn(`Failed to stringify the given value: ${error}`);
    return null;
  }
}

export const useUserAndHistory = () => {
  console.log(`useUserAndHistory..`)
  const storage = safeLocalStorage();
  if (!storage) {
    console.error('local storage not available');
    return
  }

  const [user, setUser] = useState<User>(() => safeParsing(storage?.getItem(userInfoKey)) || null);
  const [history, setHistory] = useState<any[]>(() => safeParsing(storage?.getItem(historyKey)) || []);

  useEffect(() => {
    if (!user) {
      const newUser = Math.random().toString(16);
      setUser(newUser);
      storage?.setItem(userInfoKey, safeStringify(newUser) || '');
    } else {
      storage?.setItem(userInfoKey, safeStringify(user) || '');
    }
  }, [user]);

  useEffect(() => {
    storage?.setItem(historyKey, safeStringify(history) || '');
  }, [history]);

  return { info: { user, history }, setter: { setUser, setHistory } };
};