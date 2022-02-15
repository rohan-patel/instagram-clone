import PropTypes from 'prop-types'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  updateLoggedInUserFollowing,
  updatefollowedUserFollowers,
} from '../../services/firebase'
import { ReactComponent as LoadingSvg } from '../../svg/loading2.svg'

// rgba(38, 38, 38, 0.5335483870967741)  loading animation fill color

// TODO: add the loading Animation while updating firestore for follow

export default function SuggestedProfile({
  profileDocId,
  username,
  profileId,
  userId,
  loggedInUserDocId,
}) {
  const [followed, setFollowed] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  async function handleFollowUser() {
    setIsUpdating(true)

    await updateLoggedInUserFollowing(loggedInUserDocId, profileId, followed)

    await updatefollowedUserFollowers(profileDocId, userId, followed)

    setIsUpdating(false)

    setFollowed(!followed)
  }

  return (
    <div className='flex flex-row items-center justify-between'>
      <div className='flex items-center justify-between'>
        <img
          className='rounded-full w-8 h-8 flex'
          src={`/images/avatars/${username}.jpg`}
          alt=''
        />
        <Link to={`/p/${username}`}>
          <p className='font-bold text-sm ml-3'>{username}</p>
        </Link>
      </div>
      <button
        className={`text-xs font-bold ${
          followed ? 'text-black-light' : 'text-blue-medium'
        }`}
        type='button'
        onClick={handleFollowUser}
      >
        {isUpdating ? (
          <LoadingSvg fill='rgba(38, 38, 38, 0.5335483870967741)' />
        ) : followed ? (
          'Following'
        ) : (
          'Follow'
        )}
      </button>
    </div>
  )
}

SuggestedProfile.propTypes = {
  profileDocId: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  profileId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  loggedInUserDocId: PropTypes.string.isRequired,
}
