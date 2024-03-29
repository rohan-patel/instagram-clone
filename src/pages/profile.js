import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getUserByUsername } from '../services/firebase'
import * as ROUTES from '../constants/routes'
import Header from '../components/header'
import UserProfile from '../components/Profile'

export default function Profile() {
  const { username } = useParams()
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  const [hasProfileImageChanged, setHasProfileImageChanged] = useState(true)

  useEffect(() => {
    async function checkUserExits() {
      const user = await getUserByUsername(username)
      if (user.length > 0) {
        setUser(user[0])
      } else {
        navigate(ROUTES.NOT_FOUND)
      }
    }

    checkUserExits()
  }, [username, navigate])
  return user?.username ? (
    <div className='bg-gray-background'>
      <Header
        hasProfileImageChanged={hasProfileImageChanged}
        setHasProfileImageChanged={setHasProfileImageChanged}
      />
      <div className='mx-auto max-w-screen-lg mt-20'>
        <UserProfile
          user={user}
          hasProfileImageChanged={hasProfileImageChanged}
          setHasProfileImageChanged={setHasProfileImageChanged}
        />
      </div>
    </div>
  ) : null
}
