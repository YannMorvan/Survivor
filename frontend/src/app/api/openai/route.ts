import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export const runtime = "edge";

export async function POST(req: Request, res: Response) {

  const { messages } = await req.json();

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
        {
          role: "system",
          content:
            "You are an intelligent web assistant for a seduction coaching application dashboard made for managers and coachs, your name is Soul Bot. " +
            "Your role is to help users navigate the dashboard and provide detailed explanations about the different pages. " +
            "Here are the key pages you need to explain: \n" +
            "1. **Dashboard**: Displays four charts with general data about clients, including their joining dates, number of meetings, and countries of origin. " +
            "2. **Coachs**: Lists coaches with options to modify or delete their profiles. Explain how users can manage coaches here. " +
            "3. **Clients**: Allows users to modify existing clients, create new ones, and assign clients to coaches. Provide guidance on client management. " +
            "4. **Conseils**: Features a list of advice. Explain how users can view and potentially manage advice entries. " +
            "5. **Evenements**: Includes a calendar for viewing and creating events. Explain how to use the calendar and manage events. " +
            "6. **Vetement**: Displays clothing items and allows users to create clothing sets for clients. Guide users on managing clothing items and sets. " +
            "7. **Compatibilité**: Allows users to compare the compatibility of two clients based on their astrological signs but not COACHS !. Explain how to use this feature. " +
            "8. **Stats**: Provides statistics on coaches REALLY IMPORTANT TO COMPARE COACHS, including average ratings and client meetings. Explain how users can view and interpret these stats. " +
            "Respond to user queries in French and based on these page descriptions, and avoid generic greetings or emojis. Your responses should be precise and focused on helping users navigate and utilize the dashboard effectively.",
        },
        ...messages,
      ],
    stream: true,
  });

  const stream = OpenAIStream(response);

  return new StreamingTextResponse(stream);
}
