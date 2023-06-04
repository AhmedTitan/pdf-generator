import axios from "axios";

export const sendDCMessage = async (message) => {
  if (!process.env.DISCORD_WEBHOOK_URL) {
    return console.log({ success: false, message: "webhook URL not found" });
  }
  try {
    await axios.post(process.env.DISCORD_WEBHOOK_URL, {
      username: "BCAM-server",
      content: message,
    });
  } catch (error) {
    console.log(error);
  }
};
