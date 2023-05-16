import Message from "./Components/Message";
import { app } from "./firebase";
import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Container,
  HStack,
  Input,
  VStack,
} from "@chakra-ui/react";
import {
  onAuthStateChanged,
   signOut, 
   GoogleAuthProvider, 
   getAuth, 
   signInWithPopup} from 'firebase/auth';

import {getFirestore, addDoc, collection}
from 'firebase/firestore';

const auth =getAuth(app);
const db = getFirestore(app);

const loginHandler = ()=>{

  const provider = new GoogleAuthProvider();

  signInWithPopup(auth, provider)
}

const logoutHandler =()=> signOut(auth); 




function App() {
  const [user,setUser] = useState(false);


  const submitHandler = async(e) =>{
    e.prevantDefault();
  
    try{
  
      await addDoc(collection(db,"Messages"),{
        text: "ADAS",
        uid: user.uid,
        
      })
    }
  
    catch(error){
      alert(error)
    }
  }
  

  useEffect(()=>{
   const unsubscribe =  onAuthStateChanged(auth,(data)=>{console.log(data)
    setUser(data)
  });

  return ()=>{
    unsubscribe();
  };
});




  return (
    <Box bg={"red.50"}>
      {
        user?(
          <Container h={"100vh"} bg={"white"}>
        <VStack h={"full"} paddingY={"4"}>
          <Button onClick={logoutHandler} w={"full"} colorScheme={"red"}>
            Logout
          </Button>
          <VStack h="full" w="full" overflowY={"auto"}>
            <Message text={"sample"} />
            <Message text={"sample"} user={"me"} />
          </VStack>

          <form onSubmit={submitHandler} style={{ width: "100%" }}>
            <HStack>
              <Input placeholder="Enter a message" />
              <Input />
              <Button colorScheme={"purple"} type="submit">
                {" "}
                send{" "}
              </Button>
            </HStack>
          </form>
        </VStack>
      </Container>

        ) : <VStack bg="white" justifyContent={"center"} h="100vh">
          <Button onClick={loginHandler} colorScheme={"purple"}>Sign In with Google</Button>
        </VStack>
      }
          </Box>
  );
}

export default App;
