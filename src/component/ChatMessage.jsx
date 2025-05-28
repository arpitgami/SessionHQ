
const ChatMessage = ({ name, message, isSelf }) => {
  return (
    <div className={`chat ${isSelf ? "chat-end" : "chat-start"}`}>
      <div className="chat-header">
        {name}
      </div>
      <div className="chat-bubble chat-bubble-neutral ">{message}</div>
    </div>
  );
};

export default ChatMessage;
