
import { useState } from 'react';
import './App.css'
import {useQuery, useMutation, gql} from "@apollo/client"

function App() {
  const GET_USERS = gql`
    query GetUsers {
      getUsers {
        id
        age,
        name,
        isMarried
      }
    }
  `;

  const GET_USERS_BY_ID = gql`
    query GetByUserId($id: ID!){
      getUserById(id:$id){
        id,
        age,
        name,
        isMarried
      }
    }
  `;
  

  const CREATE_USER = gql`
  mutation CreateUser($name: String!, $age: Int!, $isMarried: Boolean!) {
      createUser(name: $name, age: $age, isMarried: $isMarried){
        name
      }
    }
  `;

  const {data: getUsersData, error: getUsersError, loading: getUsersLoading} = useQuery(GET_USERS)
  const {data: getByUserIdData, loading: getByUserIdLoading} = useQuery(GET_USERS_BY_ID, {
    variables:{id: "2"}
  })

  const [newUser, setNewUser] = useState({})
  const [createUser] = useMutation(CREATE_USER)

  if(getUsersLoading) return <p>Data Loading ...</p>
  if(getUsersError) return <p>Error: {getUsersError.message}</p>

  const handleCreateUser = async() => {
    createUser({
      variables:{
        name:newUser.name,
        age:Number(newUser.age),
        isMarried:false
      }
    })
  }
  return (
    <div>
      <div>
        <input placeholder='Name' onChange={(e)=>setNewUser((prev)=>({...prev, name:e.target.value}))}/>
        <input placeholder='Age' type='number'onChange={(e)=>setNewUser((prev)=>({...prev, age:e.target.value}))}/>
        <button onClick={handleCreateUser}>Create User</button>
      </div>
      <h1>Users</h1>
      <div>
        {getByUserIdLoading?<p>Loading User...</p>:(
          <>
            <h2>Chosen Users: </h2>
            <p>{getByUserIdData.getUserById.name}</p>
            <p>{getByUserIdData.getUserById.age}</p>
          </>
        )}
      </div>
      <div>{getUsersData.getUsers.map((user)=>
        (
          <div>
            <p>Name : {user.name}</p>
            <p>Age : {user.age}</p>
            <p>Married : {user.isMarried?"Yes":"No"}</p>
          </div>
        )
      )}</div>
    </div>
  )
}

export default App
