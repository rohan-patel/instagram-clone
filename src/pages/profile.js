import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getUserByUsername } from '../services/firebase'
import * as ROUTES from '../constants/routes'

export default function Profile() {
  const {username} = useParams()
  const [user, setUser] = useState(null)
  const [userExists, setUserExists] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    async function checkUserExits() {
      const user = await getUserByUsername(username)
      if (user.length > 0) {
        setUser(user[0])
        setUserExists(true)
      } else {
        setUserExists(false)
        navigate(ROUTES.NOT_FOUND)
      }
    }

    checkUserExits()
  }, [username, navigate])
  return userExists ? (
    <div className="bg-gray-background">
      <div className="mx-auto max-w-screen-lg">
        {username}
      </div>
    </div>
  ) : null
}