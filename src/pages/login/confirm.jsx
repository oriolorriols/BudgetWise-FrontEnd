import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../contexts/authContext"
import { Button, Spin } from 'antd';
import './confirm.scss'

const Confirm = () => {
  const [message, setMessage] = useState('Confirmando usuario...');
  const [loading, setLoading] = useState(true);

  const { userid } = useParams();

  const { setLogOut } = useAuth()

  useEffect(() => {
    if (userid) {
      fetch(`http://localhost:3000/users/confirm/${userid}`, { method: 'PATCH' })
        .then(res => res.json())
        .then(data => {
          setMessage(data.msg || '¡Gracias por confirmar tu correo!');
          setLoading(false);
        })
        .catch(error => {
          setMessage('Error al confirmar el usuario.');
          setLoading(false);
        });
    }
  }, [userid]);

  return (
    <div className='flex justify-center items-center h-screen wrapper'>
      <div className='max-w-md card'>
        <div className='mb-5'>
          <img className="m-auto" src="/BudgetWiseGB.png" width="250px" alt="BudgetWise Logo" draggable="false" />
        </div>
        <div className='confirmation-message'>
          {loading ? <Spin /> : <p>{message}</p>}
        </div>
        <div className='mt-5'>
          <Button type="primary" className="w-full" href="/login" onClick={setLogOut()}>
            Ir a Iniciar Sesión
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Confirm;
