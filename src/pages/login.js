import { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import FirebaseContext from '../context/firebase'
import image from '../../public/images/iphone-with-profile.jpg'

export default function Login() {
  const history = useNavigate()
  const { firebase } = useContext(FirebaseContext)

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')

  const [error, setError] = useState('')
  const isInValid = password === '' || emailAddress === ''

  const handleLogin = () => {}

  useEffect(() => {
    document.title = 'Login - Instagram'
  }, [])

  return (
    <div className='container flex mx-auto max-w-screen-md items-center h-screen'>
      <div className='flex w-3/5'>
        <img
          src={image}
          alt='Iphone with Instagram'
        />
      </div>
    </div>
  )
}
