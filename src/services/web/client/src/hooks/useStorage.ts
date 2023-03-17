import { useState, useEffect } from 'react';

const userInfoKey = '__chaty_user'
const historyKey = '__chaty_history'
export const useUserAndHistory = () => {
  console.log('useUserAndHistory...')
  let storage: Storage;
  try {
    storage = localStorage
  } catch (err) {
    console.error(err)
  }
  if (!storage!) {
    console.error('localStorage not support')
  }
  function serializer(value: any) {
    if (value === null || value === undefined) {
      value = ''
    }
    return JSON.stringify(value)
  }
  function deserializer(value: string | null | undefined) {
    if (value === null || value === undefined) return
    return JSON.parse(value)
  }
  function getStoreUser() {
    return storage.getItem(userInfoKey)
  }
  function setStoreUser(value: string) {
    storage.setItem(userInfoKey, value)
    return true
  }
  function getStoreHistory() : any[] {
    return deserializer(storage.getItem(historyKey)) || []
  }
  function setStoreHistory(value: any[]) {
    storage.setItem(historyKey, serializer(value))
    return true
  }

  const [user, setUser] = useState(() => getStoreUser());
  const [history, setHistory] = useState(() => getStoreHistory());
  useEffect(() => {
    if (!user) {
      console.log('init set user!')
      let onlyUser = Math.random().toString(16)
      setUser(onlyUser)
    }
    setStoreUser(user!)
  }, [user])
  useEffect(() => {
    setStoreHistory(history)
  }, [history])
  const info = {
    user,
    history
  }
  const setter = {
    setUser,
    setHistory
  }
  return { info, setter }
}