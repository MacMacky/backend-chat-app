// require modules
import express from 'express'
import helmet from 'helmet'
import compress from 'compression'
import cors from 'cors'
import cookieParser from 'cookie-parser'



import rootRoute from '../routes/root'
import signupRoute from '../routes/signup'
import loginRoute from '../routes/login'
import messageRoute from '../routes/message'
import refreshRoute from '../routes/refresh'


const app = express()

// Initialize Middlewares
app.use(helmet())
app.use(compress())
app.use(cors({
  origin: [
    'http://localhost:3000'
  ],
  credentials: true
}))
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static('public'))
app.use('/', rootRoute)
app.use('/api/login', loginRoute)
app.use('/api/signup', signupRoute)
app.use('/api/message', messageRoute)
app.use('/api/refresh', refreshRoute)

app.set('env', process.env.ENV)

// For unregistered routes
app.all('*', (req, res) => {
  //res.sendFile(path.join(__dirname, 'public', 'index.html'))
  res.status(404).json({ message: 'Not Found.' });
})

export default app