import { fetchApi } from "../utils";

export async function resetMessage(user: string) {
  try {
    const res = await fetchApi('/chat/reset','POST',{},{ userId: user })
    return res
  } catch (err) {
    console.log((err as Error).message);
    return (err as Error).message;
  }
}
export async function sendMessage(message: string, user: string) {
  try {
    const res = await fetchApi('/chat/message','POST',{},{ userId: user, message })
    return res
  } catch (err) {
    console.log((err as Error).message);
    return (err as Error).message;
  }
}
