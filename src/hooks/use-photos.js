import { useState, useEffect, useContext } from "react";
import UserContext from '../context/user'
import { getPhotos, getUserByUserId } from "../services/firebase";

export default function usePhotos() {
  const [photos, setPhotos] = useState(null)
  const {
    user: {uid: userID = ''}
  } = useContext(UserContext)

  useEffect(() => {
    async function getTimelinePhotos() {
      const [{following}] = await getUserByUserId(userID)
      let followedUserPhotos = []

      if (following.length > 0) {
        followedUserPhotos = await getPhotos(userID, following)
      }

      followedUserPhotos.sort((a, b) => b.dateCreated - a.dateCreated)
      setPhotos(followedUserPhotos)
    }
    getTimelinePhotos()
  }, [userID])

  return {photos}
}
