import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import useUser from '../../hooks/use-user'
import { isUserFollowingProfile, toggleFollow } from '../../services/firebase'
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

  const handleToggleFollow = async () => {
    setIsFollowingProfile(!isFollowingProfile)
    setFollowerCount({
      followerCount: isFollowingProfile
        ? followerCount - 1
        : followerCount + 1,
    })
    await toggleFollow(isFollowingProfile, user.docId, profileDocId, profileUserId, user.userId)
    // console.log('followerCount', followerCount)
  }

  useEffect(() => {
    const isLoggedInUserFollowingProfile = async () => {
      const isFollowing = await isUserFollowingProfile(
        user.username,
        profileUserId
      )
      console.log('isFollowing', isFollowing)
      setIsFollowingProfile(isFollowing)
      console.log('isFollowingProfile', isFollowingProfile)
    }
    if (user.username && profileUserId) {
      isLoggedInUserFollowingProfile()
    }
  }, [user.username, profileUserId])

  return (
    <div className='grid grid-cols-3 gap-4 justify-between mx-auto max-w-screen-lg mt-24'>
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
            <button
              className='bg-blue-medium font-bold text-sm rounded text-white w-20 h-8'
              type='button'
              onClick={handleToggleFollow}
            >
              {isFollowingProfile ? 'Unfollow' : 'Follow'}
            </button>
          )}
        </div>
        <div className='container flex mt-4'>
          {followers === undefined || following === undefined ? (
            <Skeleton count={1} width={677} height={24} />
          ) : (
            <>
              <p className='mr-10'>
                <span className='font-bold'>{photosCount}</span>
                {` `}
                {photosCount === 1 ? `post` : `posts`}
              </p>
              <p className='mr-10'>
                <span className='font-bold'>{followerCount}</span>
                {` `}
                {followers.length === 1 ? `follower` : `followers`}
              </p>
              <p className='mr-10'>
                <span className='font-bold'>{following.length}</span>
                {` following`}
              </p>
            </>
          )}
        </div>
        <div className='container mt-4'>
          <p className='font-medium'>
            {!fullName ? <Skeleton count={1} height={24} /> : fullName}
          </p>
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
