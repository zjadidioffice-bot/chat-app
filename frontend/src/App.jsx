import { useState, useEffect, useRef } from "react";
import "./App.css"

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [name, setName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const messageEndRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages]);
  const getUsers = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      "http://localhost:3000/api/users",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await response.json();
    if (response.ok) {
      setUsers(data);
    }
    else {
      console.log(data.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const response = await fetch(
      "http://localhost:3000/api/users/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email: registerEmail,
          password: registerPassword
        })
      }
    );

    const data = await response.json();

    if (response.ok) {
      console.log("register successfull");
      setName("");
      setRegisterEmail("");
      setRegisterPassword("");

      setShowRegister(false);
    }
    else {
      console.log(data.message)
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch(
      "http://localhost:3000/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    }
    );
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user._id)
      setIsLoggedIn(true);
      console.log("login successfull")
      getUsers();
    }
    else {
      console.log(data.message);
    }
  };


  const getMessages = async (userId) => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:3000/api/messages/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    const data = await response.json();
    if (response.ok) {
      setMessages(data);
    }
    else {
      console.log(data.message);
    }
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    getMessages(user._id)
  }

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedUser) {
      return;
    }
    const token = localStorage.getItem("token");
    const response = await fetch(
      "http://localhost:3000/api/messages",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          reciver: selectedUser._id,
          message: messageText
        })
      }
    );
    const data = await response.json();
    if (response.ok) {
      setMessages([...messages, data.data]);
      setMessageText("");
    } else {
      console.log(data.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    setIsLoggedIn(false);
    setUsers([])
    setMessages([]);
    setSelectedUser(null)
  };

  return (
    !isLoggedIn ? (
      showRegister ? (
        <div className="login-container">
          <h1>Register</h1>
          <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="email"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="password"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
            />
            <button type="submit">register</button>
            <button onClick={() => setShowRegister(false)}>
              back to login
            </button>
          </form>
        </div>
      ) : (
        <div className="login-container">
          <h1>login</h1>
          <form onSubmit={handleLogin}>
            <input type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)}
            />
            <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">login</button>
          </form>

          <button onClick={() => setShowRegister(true)}>
            craete acount
          </button>
        </div>
      )
      ): (
      <div className="chat-container">
        <div className="users-section">
          <button className="logout-button" onClick={handleLogout}>logout</button>
          <h2>users</h2>
          {
            users.map((user) => (
              <div className="user" key={user._id} onClick={() => handleSelectUser(user)}
                style={{ cursor: "pointer" }}
              >
                <p>{user.name}</p>
                <p>{user.email}</p>
              </div>
            ))
          }
        </div>

        <div className="chat-section">
          {selectedUser ?
            (
              <>
                <div className="chat-header">
                  <h2>chat with {selectedUser.name}</h2>
                </div>
                <div className="messages-container">
                  {messages.map((message) => (
                    <div className={String(message.sender) === localStorage.getItem("userId") ? "message my-message"
                      : "message other-message"} key={message._id}>
                      <p>{message.message}</p>
                    </div>
                  ))}

                  <div ref={messageEndRef}></div>
                </div>

                <form className="message-form" onSubmit={sendMessage}>
                  <input type="text" placeholder="write a message..." value={messageText} onChange={(e) =>
                    setMessageText(e.target.value)}
                  />
                  <button type="submit">send</button>
                </form>
              </>
            ) : (
              <div className="chat-header">
                <h2>select a user to start chatting</h2>
              </div>
            )

          }
        </div>
      </div>
      )
    );
}

export default App;