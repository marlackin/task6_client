import React, {useEffect, useRef, useState} from 'react';
import {Form,Container,Button,Alert,ListGroup,Nav} from 'react-bootstrap';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';

const WebSock= ()=> {
    const [messages, setMessages] = useState([]);
    const [value, setValue] = useState([]);
    const socket = useRef('')
    const [connected, setConnected] = useState(false);
    const [username, setUsername] = useState({userName:''})
    const [themes, setTheme] = useState([])
    const [users,setUsers] = useState([]);
    const [usersOptions, setUsersOptions] = useState({userName:'',theme:''})


     const connect = ()=> {
        socket.current = new WebSocket('ws://localhost:7000')

        socket.current.onopen = () => {
            setConnected(true)
            const user = {
                event: 'connection',
                username,
                id: Date.now()
            }
            socket.current.send(JSON.stringify(user))
        }
        socket.current.onmessage = (event) => {
            const message = JSON.parse(event.data)
            setMessages(prev => [message, ...prev])
        }
        socket.current.onclose= () => {
            console.log('Socket закрыт')
        }
        socket.current.onerror = () => {
            console.log('Socket произошла ошибка')
        }
    }

    // useEffect(() =>{
    //     axios.get('http://localhost:5000/getAllUsers',username.userName)
    //     .then(res=>{
    //        if(res.status === 200){
    //         setUsers(res.data);
    //         console.log(users)
    //       }
    //     }) 
    //     .catch(console.log("fasfasf"))
    //  },[])

    const handleSubmit = (event) => {
      event.preventDefault()
      console.log(username)
      axios.post('http://localhost:5000/register',username)
      .then(res=>{
         if(res.status === 200){
          alert('вы выошли')
        }
      })
      .catch(err=>{if(err.response){
        alert('Ошибка регистрации')
      }})
  }
    
  if(!connected){
    return (
        <Container className='container-my'>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label className='label'>Имя</Form.Label>
            <Form.Control value={username.userName} onChange={e=>setUsername({userName: e.target.value})} type="text" placeholder="Введите имя"  />
            <Button onClick={connect} variant="outline-success" type='submit' className='btn-send'>Войти</Button>
          </Form.Group>
        </Form>
        </Container>
    )
  }

  const usersOption = () =>{
            axios.post('http://localhost:5000/getAllUsers',{userName:username.userName})
        .then(res=>{
           if(res.status === 200){
            console.log(res)
            setUsers(res.data);
            console.log(users)
          }
        }) 
        .catch(console.log("fasfasf"))
  }
  const currentUser=(currentUser)=>{
    console.log(currentUser)
  }


  const sendMessage = async () => {
    const message = {
        username:username.userName,
        message: value,
        id: Date.now(),
        event: 'message'
    }
    socket.current.send(JSON.stringify(message));
    setValue('')
}


  return (
    <>
    <Container className='container-my'>
    <Form>
    <Form.Select onClick={usersOption} onChange={e=>setUsersOptions(e.target.value)} aria-label="Default select example">
      {users.map(user =><option  key={user.userName}>
        {user.event === 'connection' 
        ? user.username.userName
        : user.userName
        }
        </option>)}
    </Form.Select>
      {/* {users.map(user =><Form.Select  key={user.userName}>
        {user.event === 'connection' 
        ? <option className='alert'>пользователь {user.username.userName} подключился</option>
        : <option className='alert'>{user.userName}</option>
        }
        </Form.Select>)} */}
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label  className='label'>Введите сообщение</Form.Label>
        <Form.Control value={value} onChange={e=>setValue(e.target.value)} as="textarea" rows={2} />
        <Button onClick={sendMessage} variant="outline-success" className='btn-send'>Отправить</Button>
      </Form.Group>
    </Form>        
    </Container>
     <Container >
    <Form.Label>
        {messages.map(mess =><Form.Label className='label' key={mess.id}>
        {mess.event === 'connection' 
        ? <Alert className='alert'>пользователь {mess.username.userName} подключился</Alert>
        : <Alert className='alert'>{mess.username}: {mess.message} {new Date().toLocaleString()}</Alert>
        }
        </Form.Label>)}
        </Form.Label>
      </Container> 
    </>
  )
}

export default WebSock