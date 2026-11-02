import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../api/axios";


function ProtectedRoute({children}){

 const [loading,setLoading]=useState(true);
 const [user,setUser]=useState(null);



 useEffect(()=>{

   checkUser();

 },[]);


 const checkUser = async()=>{

   try{

    const res = await api.get("/auth/me");
console.log("ME RESPONSE:",res.data);
    setUser(res.data.user);

   }
   catch(error){

    setUser(null);

   }
   finally{

    setLoading(false);

   }

 }


 if(loading){
   return <h1>Loading...</h1>
 }


 if(!user){
   return <Navigate to="/" />
 }


 return children;

}

export default ProtectedRoute;