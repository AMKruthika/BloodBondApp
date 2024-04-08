require('dotenv').config()
const mongoose=require('mongoose')
const express=require('express')
const cors=require('cors')
const {checkSchema}=require('express-validator')
const app=express()
const port=3080
app.use(express.json())
app.use(cors())

//DB CONNECTION
const configureDB=require('./config/db')
configureDB()
 

//1)***(CONTROLLERS)***//

//IMPORTING USER-CONTROLLER
const userCltr=require('./app/controllers/users-controller')
//IMPORTING BLOOD-REQUEST-CONTROLLER
const bloodRequestCltr=require('./app/controllers/blood-request-controller')
//IMPORTING USERPROFILE-CONTROLLER
const userProfilecltr=require('./app/controllers/users-profile-controller')


//2)***(VALIDATORS)***//

//IMPORTING BLOOD-REQUEST-VALIDATION-SCHEMA
const bloodRequestValidationSchema=require('./app/validators/bloodRequest-validation-schema')
//IMPORTING USER-VALIDATION-SCHEMA
const {userRegisterValidationSchema,userLoginValidationSchema}=require('./app/validators/user-validation-schema')
//IMPORTING USERPROFILE-VALIDATION-SCEHMA
const userProfileValidationSchema=require('./app/validators/userProfile-validation-schema')
//IMPORTING REVIEW VALIDATION-SCHEMA
const reviewValidationSchema=require('./app/validators/review-validation-schema')

//3)***(AUTHENTICATION && AUTHORIZATION)***//

//IMPORTING AUTHENTICATION AND AUTHORIZATION
const {authenticateUser,authorizeUser,assignUserRole}=require('./app/middlewares/auth')


//4)***(ROUTERS)***//

//ROUTE FOR USER-REGISTER AND LOGIN AND ACCOUNT
app.post('/api/user/register',checkSchema(userRegisterValidationSchema),userCltr.register)
app.post('/api/user/login',checkSchema(userLoginValidationSchema),userCltr.login)
app.get('/api/user/account',authenticateUser,authorizeUser(['admin']),userCltr.account)

//ROUTE FOR USER-PROFILE(CRUD)
app.post('/api/user/profile',authenticateUser,authorizeUser(['user']),checkSchema(userProfileValidationSchema),userProfilecltr.create)
app.get('/api/user/profiles',authenticateUser,authorizeUser(['admin']),userProfilecltr.display)
app.get('/api/user/profile',authenticateUser,authorizeUser(['user']),userProfilecltr.show)
app.delete('/api/user/profile/:id',authenticateUser,authorizeUser(['user']),userProfilecltr.delete)
app.put('/api/user/profile/:id',authenticateUser,authorizeUser(['user']),checkSchema(userProfileValidationSchema),userProfilecltr.update)

//ROUTE FOR BLOOD-REQUEST(CRUD)
app.post('/api/blood/request',authenticateUser,authorizeUser(['user']),checkSchema(bloodRequestValidationSchema),bloodRequestCltr.create)
app.get('/api/blood/request',authenticateUser,authorizeUser(['user']),bloodRequestCltr.display)
app.get('/api/blood/request/list',authenticateUser,authorizeUser(['user']),bloodRequestCltr.list)
app.put('/api/blood/request/:id',authenticateUser,authorizeUser(['user']),checkSchema(bloodRequestValidationSchema),bloodRequestCltr.update)
app.delete('/api/blood/request/:id',authenticateUser,authorizeUser(['user']),bloodRequestCltr.delete)

app.listen(port,()=>
{
    console.log('Blood-Bond-App is successfully running on the port',port)
})