import React, {useEffect, useRef, useState} from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import {Form,Container,Button,Alert,ListGroup,Nav} from 'react-bootstrap';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
import DropDown from './DropDown'

const WebSock= ()=> {
    const [messages, setMessages] = useState([]);
    const [value, setValue] = useState([]);
    const socket = useRef('')
    const [connected, setConnected] = useState(false);
    const [username, setUsername] = useState({userName:''})
    const [users,setUsers] = useState([]);
    const [usersDrop,setUsersDrop] = useState([]);
    const [usersOptions, setUsersOptions] = useState({userTo:'',theme:'',message:''})
    const [userMessages, setUserMessages] = useState([])


     const connect = ()=> {
        socket.current = new WebSocket('wss://task6client.herokuapp.com/')

        socket.current.onopen = () => {
            setConnected(true)
            const user = {
              userName:username.userName,
              theme:usersOptions.theme,
              userTo:usersOptions.userTo,
              message: usersOptions.message,
              date: usersOptions.date,
              event: 'connection'
            }
              axios.post('https://task6server.herokuapp.com/allUsersMessage',{userName:username.userName})
          .then(res=>{
             if(res.status === 200){
              console.log(res)
              setUsers(res.data)
              setUserMessages(res.data);
              res.data.sort(function(a,b){
                return new Date(b.date) - new Date(a.date);
              })
            }
          }) 
          .catch(console.log("fasfasf"))
          socket.current.send(JSON.stringify(user))
        }
        socket.current.onmessage = (event) => {
            const message = JSON.parse(event.data)
            console.log(message)
            setUserMessages(prev => [message, ...prev])
        }
        socket.current.onclose= () => {
            console.log('Socket закрыт')
        }
        socket.current.onerror = () => {
            console.log('Socket произошла ошибка')
        }
    }



    const handleSubmit = (event) => {
      event.preventDefault()
      console.log(username)
      axios.post('https://task6server.herokuapp.com/register',username)
      .then(res=>{
         if(res.status === 200){
          alert('вы вошли')
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




  function usersOption(){
            axios.post('http://localhost:5000/getAllUsers',{userName:username.userName})
        .then(res=>{
           if(res.status === 200){
            console.log(res)
            setUsersDrop(res.data);
            console.log(res.data)
          }
        
        }) 
        .catch(console.log("fasfasf"))
  }


  const sendMessage = (event) =>{
    event.preventDefault()
    const messagesUser = {
      userFrom:username.userName,
      theme:usersOptions.theme,
      userTo:usersOptions.userTo,
      message: usersOptions.message,
      date:new Date(),
      event: 'message'
    }
    axios.post('http://localhost:5000/sendMessage',messagesUser)
.then(res=>{
   if(res.status === 200){
    console.log(res)
    socket.current.send(JSON.stringify(messagesUser));
    console.log('я тут')
    // setMessages(prev => [messages, ...prev])
    // setUsers(res.data);
    // console.log(users)
  }
}) 
.catch(console.log("fasfasf"))
}

//   const sendMessage = async () => {
//     const message = {
//         username:username.userName,
//         theme:usersOptions.theme,
//         userTo:usersOptions.userTo,
//         message: usersOptions.message,
//         date: new Date().toLocaleString(),
//         event: 'message'
//     }
//     console.log(message)
//     socket.current.send(JSON.stringify(message));
//     setValue('')
// }

  return (
    <>
    
    <Container className='container-my'>
    <Form onSubmit={sendMessage}>
    <DropDown  options={usersDrop.map((user,index) => {
              const qwe =  {
              label:user.userName,
              key:index}
              return qwe
            })} onClick={usersOption} onChange={e=>setUsersOptions({...usersOptions,userTo: e.label})}></DropDown>
    {/* <Form.Select onClick={usersOption} onChange={e=>setUsersOptions({...usersOptions,userTo: e.target.value})} aria-label="Default select example">
      <option disabled>Выберите собеседника</option>
      {usersDrop.map(user =><option  key={user.userName}>
        {user.event === 'connection' 
        ? user.userName
        : user.userName
        }
        </option>)}
    </Form.Select> */}
    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Тема</Form.Label>
        <Form.Control onChange={e=>setUsersOptions({...usersOptions,theme: e.target.value})} type="text" placeholder="Введите тему" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label  className='label'>Введите сообщение</Form.Label>
        <Form.Control onChange={e=>setUsersOptions({...usersOptions,message: e.target.value})} as="textarea" rows={2} />
      </Form.Group>
      <Button type="submit" variant="outline-success" className='btn-send'>Отправить</Button>
    </Form>        
    </Container>
     <Container >
    <Form.Label>
        {userMessages && userMessages.map(user =><Form.Label className='label alert_mess' key={user._id}>
        {user.event === 'connection' 
        ? <Alert className='alert'>пользователь {user.userName} подключился</Alert>
        : <Alert className='alert'>От: {user.userFrom} | Кому: {user.userTo} | Тема: {user.theme} | Сообщение :{user.message} | Дата: {user.date}</Alert>
        }
        </Form.Label>)}
        </Form.Label>
      </Container> 
    </>
  )
}

export default WebSock