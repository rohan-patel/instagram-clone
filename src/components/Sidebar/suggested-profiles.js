import PropTypes from 'prop-types'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {updateLoggedInUserFollowing, updatefollowedUserFollowers} from '../../services/firebase'

// TODO: add the loading Animation while updating firestore for follow

export default function SuggestedProfile({
  profileDocId,
  username,
  profileId,
  userId,
  loggedInUserDocId,
}) {
  const [followed, setFollowed] = useState(false)

  async function handleFollowUser() {
    await updateLoggedInUserFollowing(loggedInUserDocId, profileId, followed)
    
    await updatefollowedUserFollowers(profileDocId, userId, followed)
    
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
        {followed ? 'Following' : 'Follow'}
      </button>
    </div>
  )
}

SuggestedProfile.propTypes = {
  profileDocId: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  profileId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  loggedInUserDocId: PropTypes.string.isRequired
}
