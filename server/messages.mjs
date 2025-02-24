
import { generateRandomId } from "./utils.mjs";

export const buildMessage = (session, message) => {
  return {
    id: generateRandomId(),
    userId: session.userId,
    username: session.username,
    message,
  }
}
