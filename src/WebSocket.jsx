import React, {useEffect, useRef, useState} from 'react';
import {Form,Container,Button} from 'react-bootstrap';
import axios from 'axios';

const WebSocket= ()=> {
    const [messages, setMessages] = useState([]);
    const [value, setValue] = useState('');
    const socket = useRef()
    const [connected, setConnected] = useState(false);
    const [username, setUsername] = useState('')

    function connect() {
        socket.current = new WebSocket('ws://localhost:5000')

        socket.current.onopen = () => {
            setConnected(true)
            const message = {
                event: 'connection',
                username,
                id: Date.now()
            }
            socket.current.send(JSON.stringify(message))
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

    const sendMessage = async () => {
        const message = {
            username,
            message: value,
            id: Date.now(),
            event: 'message'
        }
        socket.current.send(JSON.stringify(message));
        setValue('')
    }

  if(!connected){
    return (
        <Container className='container-my'>
        <Form>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label className='label'>Имя</Form.Label>
            <Form.Control value={username} onChange={e=>setUsername(e.target.value)} type="text" placeholder="Введите имя"  />
            <Button onClick={connect} variant="outline-success" className='btn-send'>Войти</Button>
          </Form.Group>
        </Form>
        </Container>
    )
  }

  return (
    <Container className='container-my'>
    <Form>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label className='label'>Имя</Form.Label>
        <Form.Control value={value} onChange={e=>e.target.value} type="text" placeholder="Введите имя"  />
        <Button onClick={sendMessage} variant="outline-success" className='btn-send'>Отправить</Button>
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label className='label'>Введите сообщение</Form.Label>
        <Form.Label value={value} onChange={e=>setValue(e.target.value)} className='label'>{messages.map(mess =><Form.Label className='label' key={mess.id}>{mess.message}</Form.Label>)}</Form.Label>
        <Form.Control as="textarea" rows={2} />
        <Button variant="outline-success" className='btn-send'>Отправить</Button>
      </Form.Group>
    </Form>
    </Container>
  )
}

export default WebSocket