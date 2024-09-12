import { useChat } from "ai/react";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { Sparkles, User } from "lucide-react";

const Chat = () => {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/openai",
  });

  const chatContainer = useRef<HTMLDivElement>(null);

  const scroll = () => {
    if (chatContainer.current) {
      const { offsetHeight, scrollHeight, scrollTop } = chatContainer.current;
      if (scrollHeight >= scrollTop + offsetHeight) {
        chatContainer.current.scrollTo(0, scrollHeight + 200);
      }
    }
  };

  useEffect(() => {
    scroll();
  }, [messages]);

  const renderResponse = () => {
    if (messages.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-600 text-sm">
          <p className="text-center">Ici commence votre conversation avec Soul Bot.</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col space-y-1.5 gap-5 pb-6">
        {messages.map((m, index) => (
          <div
            key={m.id}
            className={`flex gap-3 my-4 mt-5 text-gray-600 text-sm flex-1 ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
              <div className="rounded-full bg-gray-100 border p-1">
                {m.role === "user" ? (
                    <User size={20} />
                ) : (
                    <Sparkles size={20} />
                )}
              </div>
            </span>
            <p className="leading-relaxed">
              <span className="block font-bold text-gray-700">{m.role === "user" ? "You" : "Soul Bot"}</span>
              {m.content}
            </p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      ref={chatContainer}
      className="fixed z-50 top-20 right-0 mr-4 bg-white p-6 rounded-lg border border-[#e5e7eb] w-[440px] h-[634px]"
      style={{ boxShadow: '0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0 0 0 / 0.05)' }}
    >
      <div className="flex flex-col space-y-1.5 pb-6">
        <h2 className="font-semibold text-lg tracking-tight">Soul Bot</h2>
        <p className="text-sm text-[#6b7280] leading-3">Propulsé par OpenAi et Soul Connection</p>
      </div>

      <div className="pr-4 h-[474px] overflow-y-auto">
        {renderResponse()}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center justify-center w-full space-x-2 pt-2">
        <input
          name="input-field"
          type="text"
          placeholder="Entrez votre message"
          onChange={handleInputChange}
          value={input}
          className="flex h-10 w-full rounded-md border border-[#e5e7eb] px-3 py-2 text-sm placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#9ca3af] disabled:cursor-not-allowed disabled:opacity-50 text-[#030712] focus-visible:ring-offset-2"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium text-[#f9fafb] disabled:pointer-events-none disabled:opacity-50 bg-black hover:bg-[#111827E6] h-10 px-4 py-2"
        >
          Envoie
        </button>
      </form>
    </div>
  );
};

export default Chat;
