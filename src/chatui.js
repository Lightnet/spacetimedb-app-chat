// Chat UI test layout
// 
import van from "https://cdn.jsdelivr.net/gh/vanjs-org/van/public/van-1.6.0.min.js"
// import van from "vanjs-core"

const { div, input, button, form, hr, label, pre, span } = van.tags;

// console.log( ChatMessage({role:'test', content:'test'}) );
function ChatMessage({ role, content }) {
  // console.log(label('[test]'));
  // return label('[test]')
  return div(
    { class: () => `message ${role}` },
    span({ class: "role" }, role === "user" ? "You" : "AI"),
    pre({ class: "content" }, content)
  )
}

function ChatApp() {
  const messages = van.state([
    { role: "ai", content: "Hi! How can I help you today? 😊" }
  ])

  const inputText = van.state("")
  const isSending  = van.state(false)

  const addMessage = (role, content) => {
    messages.val = [...messages.rawVal, { role, content }];
    // console.log(van);
    setTimeout(()=>{
      const container = document.getElementById('messages');
      if (container) {
        container.scrollTop = container.scrollHeight
      }
    },50);
    
  }

  // Fake AI delay simulation
  const fakeAIResponse = (userText) => {
    isSending.val = true

    setTimeout(() => {
      let reply = "I received: " + userText

      if (/hi|hello/i.test(userText)) {
        reply = "Hey there! Nice to see you! 🚀"
      } else if (/how are you/i.test(userText)) {
        reply = "I'm just a tiny VanJS component, but I'm feeling very reactive today 😄"
      }

      addMessage("ai", reply)
      isSending.val = false
    }, 600 + Math.random() * 900)
  }

  const sendMessage = () => {
    const text = inputText.val.trim()
    if (!text || isSending.val) return

    addMessage("user", text)
    inputText.val = ""
    fakeAIResponse(text)
  }

  //watch message to update element
  // const messageElements = van.derive(() =>{
  //   return div({id:"messages", class: "messages" },
  //     messages.val.map(item=>  ChatMessage(item))
  //   )
  // })

  const messageElements = van.derive(()=>div(messages.val.map(item=>  ChatMessage(item))))

  return div(
    { class: "chat-container" },
    // messageElements,
    div(
      {id:"messages", class: "messages" },
      // ()=>messages.val.map(item=>  ChatMessage(item))// nope
      messageElements

    ),
    hr(),
    form(
      {
        class: "input-area",
        onsubmit: e => { e.preventDefault(); sendMessage() }
      },
      input({
        type: "text",
        placeholder: "Type your message...",
        value: inputText,                        // two-way binding
        oninput: e => inputText.val = e.target.value,
        // disabled: () => isSending.val,
        autofocus: true,
      }),
      button({
        type: "submit",
        disabled: () => !inputText.val.trim() || isSending.val
      }, () => isSending.val ? "..." : "Send")
    )
  )
}

// -------------------
// Minimal styles (same as before)
const style = `
  .chat-container {
    max-width: 600px;
    margin: 20px auto;
    font-family: system-ui, sans-serif;
    height: 90vh;
    display: flex;
    flex-direction: column;
  }
  .messages {
    flex: 1;
    overflow-y: auto;
    padding: 12px;
    background: #f9f9fb;
    border-radius: 8px;
  }
  .message {
    margin: 12px 0;
    padding: 10px 14px;
    border-radius: 12px;
    max-width: 80%;
  }
  .message.user {
    background: #007aff;
    color: white;
    margin-left: auto;
    border-bottom-right-radius: 4px;
  }
  .message.ai {
    background: #e5e5ea;
    color: black;
    margin-right: auto;
    border-bottom-left-radius: 4px;
  }
  .role {
    font-size: 0.75rem;
    opacity: 0.6;
    display: block;
    margin-bottom: 4px;
  }
  .content {
    margin: 0;
    white-space: pre-wrap;
    word-break: break-word;
  }
  .input-area {
    display: flex;
    gap: 8px;
    padding: 12px 0;
  }
  input {
    flex: 1;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 12px;
    font-size: 1rem;
  }
  button {
    padding: 0 20px;
    background: #007aff;
    color: white;
    border: none;
    border-radius: 12px;
    font-weight: 600;
    cursor: pointer;
  }
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  hr {
    border: none;
    border-top: 1px solid #eee;
    margin: 8px 0;
  }
`;

van.add(document.head, van.tags.style(style))
van.add(document.body, ChatApp())