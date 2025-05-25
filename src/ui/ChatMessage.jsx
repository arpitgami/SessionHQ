
const ChatMessage = ({ name, message, isSelf }) => {
  return (
    <div className={`chat ${isSelf ? "chat-end" : "chat-start"}`}>
      <div className="chat-header">
        {name}
      </div>
      <div className="chat-bubble">{message}</div>
    </div>
  );
};

export default ChatMessage;
