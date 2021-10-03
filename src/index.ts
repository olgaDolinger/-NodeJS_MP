import express, {Express, Request, Response} from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import dotenv from 'dotenv';
import {default as data} from './mock/data.json';
import { STATUS, userSchema } from './validate';


dotenv.config();

const PORT = process.env.PORT || 8080;
const app:Express = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// get user
app.get('/:id', (req: Request, res: Response) => {
  console.log('> get user', req.params.id )
  const id:string = req.params.id.toString();
  const user = data.filter((user: User)=> user.id == id);
  
  res.send(JSON.stringify(user));
});

// get users (auto suggest)
app.get('/find/:login', (req: Request, res: Response) => {
  const login:string = req.params.login.toString();
  const users = data.filter((user: User)=> {
    return user.login.toLowerCase().indexOf(login) > -1
  });
  
  res.send(users);
});

// add new user
app.post('/', (req:Request, res:Response) => {
  const user = req.body;
  const result = userSchema.validate(user);
  const { error } = result;
  const valid = error == null; 
  if(!valid){
    res.status(STATUS.VALIDATON_ERROR).json(error);
  }else{
    data.push(user as  User);
    res.send(data);
  }
});

// update user
app.post('/update', (req:Request, res:Response) => {
  const userToUpdate:User = req.body as User;
  const result = userSchema.validate(userToUpdate);
  const { error } = result;
  const valid = error == null; 
  if(!valid){
    res.status(STATUS.VALIDATON_ERROR).json(error);
  }else{
    const index = data.findIndex((user: User) => {
      console.log('>>> ', user);
      return user.id === userToUpdate.id;
    });
    if(index > -1){
      data[index] = userToUpdate;
      res.send(data);
    }else{
      res.send(`Can't find user: ${JSON.stringify(userToUpdate)}`);
    }
  }
});

// delete user
app.delete('/:id', (req:Request, res:Response) => {
  const id:string = req.params.id.toString();
  const index = data.findIndex((user: User) => user.id === id);
  if(index > 0){
    data[index].isDeleted = true;
    res.send(`User deleted ${id}`)
  }else{
    res.send(`Can't find user: ${id}`);
  }
  
});

app.listen(PORT, () => console.log(`Running on ${PORT} ⚡`));