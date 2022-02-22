import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import useUser from '../../hooks/use-user'
import { isUserFollowingProfile } from '../../services/firebase'
import { getStorage, ref, getDownloadURL } from 'firebase/storage'
import * as LINKS from '../../constants/links'

export default function Header({
  photosCount,
  profile: {
    docId: profileDocId,
    userId: profileUserId,
    fullName,
    followers,
    following,
    username: profileUsername,
  },
  followerCount,
  setFollowerCount,
}) {
  const { user } = useUser()
  const [isFollowingProfile, setIsFollowingProfile] = useState(false)
  const activeBtnFollow = user?.username && user?.username !== profileUsername

  const storage = getStorage()
  if (profileUsername) {
    getDownloadURL(
      ref(storage, `/Profile Pictures/${profileUsername}.jpg`)
    ).then((url) => {
      const img = document.getElementById(
        `profile-page-pic` + `${profileUsername}`
      )
      img.setAttribute('src', url)
    })
  } 

  const handleToggleFollow = () => {
    setIsFollowingProfile(!isFollowingProfile)
    setFollowerCount({
      followerCount: isFollowingProfile ? followers - 1 : followers + 1
    })
  }

  useEffect(() => {
    const isLoggedInUserFollowingProfile = async () => {
      const isFollowing = await isUserFollowingProfile(
        user.username,
        profileUserId
      )
      console.log('isFollowing', isFollowing)
      setIsFollowingProfile(isFollowing)
    }
    if (user.username && profileUserId) {
      isLoggedInUserFollowingProfile()
    }
  }, [user.username, profileUserId])

  return (
    <div className='grid grid-cols-3 gap-4 justify-between mx-auto max-w-screen-lg'>
      <div className='container flex justify-center'>
        {profileUsername && (
          <img
            id={`profile-page-pic${profileUsername}`}
            className='rounded-full h-40 w-40 flex'
            src={LINKS.DEFAULT_PROFILE_PIC_URL}
            alt={`${profileUsername} profile picture`}
          />
        )}
      </div>
      <div className='flex items-center justify-center flex-col col-span-2'>
        <div className='container flex items-center'>
          <p className='text-2xl mr-4 '>{profileUsername}</p>
          {activeBtnFollow && (
            <button className='bg-blue-medium font-bold text-sm rounded text-white w-20 h-8' type='button' onClick={handleToggleFollow}>
              {isFollowingProfile ? 'Unfollow' : 'Follow'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

Header.propTypes = {
  photosCount: PropTypes.number.isRequired,
  followerCount: PropTypes.number.isRequired,
  setFollowerCount: PropTypes.func.isRequired,
  profile: PropTypes.shape({
    docId: PropTypes.string,
    userId: PropTypes.string,
    fullName: PropTypes.string,
    following: PropTypes.array,
  }).isRequired,
}
