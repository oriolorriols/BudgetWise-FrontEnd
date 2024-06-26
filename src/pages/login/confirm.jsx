import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const Confirm = () => {

  const [message, setMessage] = useState('Confirming user...')

  const { userid } = useParams();
  console.log('a ver si es quien creemos', userid)

  useEffect(() => {
    if (userid) {
      fetch(`http://localhost:3000/users/confirm/${userid}`, {method: 'PATCH'})
        .then(res => res.json())
        .then(data => setMessage(data))
    }
  }, [userid])

  return (
    <div>
      <p>{message}</p>
    </div> 
  )
}