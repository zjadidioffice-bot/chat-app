import { useState,useEffect } from "react";

function App(){
  const[email,setEmail]=useState("");
  const[password,setPassword]=useState("");
  const[users,setUsers]=useState([]);
  const [selectedUser,setSelectedUser]=useState(null);
  const[messages,setMessages]=useState([]);
  const getUsers=async()=>{
    const token=localStorage.getItem("token");

    const response=await fetch(
      "http://localhost:3000/api/users",
      {
        headers:{
          Authorization:`Bearer ${token}`
        }
      }
    );

    const data=await response.json();
    if(response.ok){
      setUsers(data);
    }
    else{
      console.log(data.message);
    }
  };

  const handleLogin=async(e)=>{
    e.preventDefault();

    const response=await fetch(
      "http://localhost:3000/api/users/login",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          email,
          password
        })
      }
    );
    const data=await response.json();
    if(response.ok){
      localStorage.setItem("token",data.token);
      console.log("login successfull")
      getUsers();
    }
    else{
    console.log(data.message);
    }
  };


  const getMessages=async(userId)=>{
    const token=localStorage.getItem("token");

    const response=await fetch(
      `http://localhost:3000/api/messages/${userId}`,
      {
        headers:{
          Authorization:`Bearer ${token}`
        }
      }
    );
    const data=await response.json();
    if(response.ok){
      setMessages(data);
    }
    else{
      console.log(data.message);
    }
  };

  const handleSelectUser=(user)=>{
    setSelectedUser(user);
    getMessages(user._id)
  }
  return(
    <div>
      <h1>login</h1>
      <form onSubmit={handleLogin}>
        <input
        type="email"
        placeholder="email"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        />
        <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
        />
        <button type="submit">login</button>
      </form>

      <h2>users</h2>
      {
        users.map((user)=>(
          <div key={user._id}
          onClick={()=>handleSelectUser(user)}
          style={{cursor:"pointer"}}
          >
            <p>{user.name}</p>
            <p>{user.email}</p>
          </div>
        ))
      }

      {selectedUser &&
      <div>
        <h2>chat with {selectedUser.name}</h2>
        {messages.map((message)=>(
          <div key={message._id}>
            <p>{message.message}</p>
          </div>
        ))}
        </div>
      }
    </div>
  );
}

export default App;