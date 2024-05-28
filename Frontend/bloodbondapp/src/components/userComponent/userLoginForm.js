import {useState} from 'react'
import { Envelope,Lock } from 'react-bootstrap-icons'
import {Container,Card,Row,Col} from 'react-bootstrap'
import axios from 'axios'
import UserContext from '../../contexts/userContext'
import { useContext} from 'react'
import { useNavigate } from 'react-router-dom'
export default function UserLoginForm(){
    const navigate=useNavigate()
    const [form,setForm]=useState({
        email:'',
        password:''
    })
    const {users,userDispatch}=useContext(UserContext)
    const handleChange=(e)=>{
        const {name,value}=e.target
        setForm({...form,[name]:value})
    }
    const handleSubmit=async(e)=>{
        e.preventDefault()
        try{
            const response=await axios.post('http://localhost:3080/api/user/login',form)
            console.log(response.data)
            const token=response.data.token
            userDispatch({type:'LOGIN_USER',payload:token})
            localStorage.setItem('token',token)
            alert('logged in successfully')
            
            const userDetails=await axios.get('http://localhost:3080/api/user/account',
           {
            headers:{Authorization:localStorage.getItem('token')}
        } 
        )
        const {role}=userDetails.data
        if(role==='admin'){
            navigate('/admin/dashboard')
        }
        else if(role==='user'){
            navigate('/user/dashboard')
        }
        else if(role==='bloodbank'){
            navigate('/bloodbank/dashboard')
        }
        console.log(userDetails)
        userDispatch({type:'SET_USER',payload:userDetails.data})
        userDispatch({type:'SET_SERVER_ERRORS',payload:[]})
        } catch (err) {
            if (err.response && err.response.data && err.response.data.errors) {
                console.log(err.response.data.errors);
                userDispatch({ type: 'SET_SERVER_ERRORS', payload: err.response.data.errors });
            } 
    }
}
    return(
        <div>
            <Container>
                <Row className='justify-content-center'>
                    <Col md={6}>
                        <Card className='bg-danger text-black'>
                            <Card.Body>
                                <Card.Title>User Login Form</Card.Title>
                                <form onSubmit={handleSubmit}>
                <div className='form-group'>
                <label className='form-label' htmlFor='email'><Envelope/> Email</label>
                <input type="text"
                placeholder='Enter Email'
                value={form.email}
                onChange={handleChange}
                id='email'
                name='email'
                className='form-control'/>
                </div>
                <div className='form-group'>
                <label className='form-label' htmlFor='password'><Lock/> Password</label>
                <input type="text"
                placeholder='Enter Password'
                value={form.password}
                onChange={handleChange}
                id='password'
                name='password'
                className='form-control'/>
                </div>
                <input type='submit' className='btn btn-dark'/>
                </form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
            
            
            {users.serverErrors&&users.serverErrors.length>0?(<div>
                <h4>you are prohibited from logging in due to these errors</h4>
                <ul>
                {users.serverErrors.map((err,i)=>{
                   return <li key={i}>{err.msg}</li>
                })}
                </ul>
            </div>):(" ")}
        </div>
    )
}