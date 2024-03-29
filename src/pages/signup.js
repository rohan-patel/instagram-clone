import { useContext, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FirebaseContext from '../context/firebase'
import * as ROUTES from '../constants/routes'
import { doesUsernameExists } from '../services/firebase'
import { ReactComponent as LoadingSvg } from '../svg/loading2.svg'

export default function SignUp() {
  const history = useNavigate()
  const { firebase } = useContext(FirebaseContext)

  const [username, setUsername] = useState('')
  const [fullName, setFullName] = useState('')
  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')

  const [error, setError] = useState('')
  const [isSigningUp, setIsSigningUp] = useState(false)
  const isInValid =
    password === '' || emailAddress === '' || username === '' || fullName === ''

  const handleSignUp = async (e) => {
    e.preventDefault()

    const usernameExists = await doesUsernameExists(username)
    console.log(usernameExists)
    if (!usernameExists.length) {
      try {
        setIsSigningUp(true)

        const createdUserResult = await firebase
          .auth()
          .createUserWithEmailAndPassword(emailAddress, password)

        await createdUserResult.user.updateProfile({
          displayName: username,
        })

        await firebase.firestore().collection('users').add({
          userId: createdUserResult.user.uid,
          username: username.toLowerCase(),
          fullName,
          emailAddress: emailAddress.toLowerCase(),
          following: [],
          followers: [],
          dateCreated: Date.now(),
        })

        setIsSigningUp(false)

        history(ROUTES.DASHBOARD)
      } catch (error) {
        setFullName('')
        setUsername('')
        setEmailAddress('')
        setPassword('')
        setError(error.message)
      }
    } else {
      setError('The Username already exists. PLaese try another.')
    }
  }

  useEffect(() => {
    document.title = 'Sign Up - Instagram'
  }, [])

  return (
    <div className='container flex mx-auto max-w-screen-md items-center h-screen'>
      <div className='flex w-3/5'>
        <img
          src='/images/iphone-with-profile.jpg'
          alt='Iphone with Instagram'
        />
      </div>
      <div className='flex flex-col w-2/5'>
        <div
          className='flex flex-col items-center bg-white 
          p-4 border border-gray-primary mb-4 rounded'
        >
          <h1 className='flex justify-center w-full'>
            <img
              src='/images/logo.png'
              alt='insatgram logo'
              className='mt-2 w-6/12 mb-4'
            />
          </h1>
          {error && <p className='mb-4 text-xs text-red-primary'>{error}</p>}

          <form onSubmit={handleSignUp} method='POST'>
            <input
              aria-label='Enter your Username'
              type='text'
              placeholder='Username'
              className='text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2'
              onChange={({ target }) => setUsername(target.value)}
              value={username}
            />
            <input
              aria-label='Enter your Full Name'
              type='text'
              placeholder='Full Name'
              className='text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2'
              onChange={({ target }) => setFullName(target.value)}
              value={fullName}
            />
            <input
              aria-label='Enter your Email Address'
              type='text'
              placeholder='Email Address'
              className='text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2'
              onChange={({ target }) => setEmailAddress(target.value)}
              value={emailAddress}
            />
            <input
              aria-label='Enter your Password'
              type='password'
              placeholder='Password'
              className='text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2'
              onChange={({ target }) => setPassword(target.value)}
              value={password}
            />
            <button
              disabled={isInValid}
              type='submit'
              className={`bg-blue-medium text-white w-full rounded h-8 font-bold ${
                isInValid && 'opacity-50'
              }`}
            >
              {isSigningUp ? <LoadingSvg fill='white' /> : 'Sign Up'}
            </button>
          </form>
        </div>
        <div className='flex justify-center items-center flex-col w-full bg-white p-4 border border-gray-primary rounded'>
          <p className='text-sm'>
            Already Have an account?{` `}
            <Link to={ROUTES.LOGIN} className='font-bold text-blue-medium'>
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
