"use client";

import { useSocket } from "@/context/socket";
import ChatMessage from "./ChatMessage";
import { useState, useEffect, useRef } from "react";

const ChatSection = ({ currentUser, roomid }) => {
    const chatRef = useRef(null);
    const { socket, messages } = useSocket();

    const [text, setText] = useState("");

    useEffect(() => {
        // Scroll to bottom on new message
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages]);

    function handleSend() {
        if (text.trim() === "") return;
        socket.emit("send-message", {
            user: "arpit1",
            message: text,
            roomid: roomid
        });
        setText("");
    }

    return (
        <div className="flex flex-col h-[100vh] bg-base-100 rounded-lg p-2 mr-4 w-md">
            {/* Chat messages area */}
            <div
                className="flex-1 overflow-y-auto p-4 bg-base-200 rounded-lg"
                ref={chatRef}
            >
                {messages.map((msg, index) => (
                    <ChatMessage
                        key={index}
                        name={msg.user}
                        message={msg.message}
                        isSelf={msg.user === currentUser}
                    />
                ))}
            </div>

            {/* Input field area */}
            <div className="mt-2 flex gap-2">
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type a message..."
                    className="input input-bordered flex-1"
                />
                <button onClick={handleSend} className="btn btn-primary">
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatSection;
