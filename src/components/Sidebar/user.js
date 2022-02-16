import { memo } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { getStorage, ref, getDownloadURL } from 'firebase/storage'

export default function User({ username, fullName }) {
  
  const storage = getStorage()
  getDownloadURL(ref(storage, `/Profile Pictures/${username}.jpg`)).then(
    (url) => {
      const img = document.getElementById('sidebar-user-profile-pic')
      img.setAttribute('src', url)
    }
  )

  return !username || !fullName ? (
    <Skeleton count={1} height={61} />
  ) : (
    <Link
      to={`/p/${username}`}
      className='grid grid-cols-4 gap-4 mb-6 items-center'
    >
      <div className='flex items-center justify-between col-span-1'>
        <img
          className='rounded-full w-14 h-14'
          id='sidebar-user-profile-pic'
          src={`/images/avatars/${username}.jpg`}
          alt=''
        />
      </div>
      <div className='col-span-3 '>
        <p className='font-bold text-sm'>{username}</p>
        <p className='text-sm'>{fullName}</p>
      </div>
    </Link>
  )
}

User.propTypes = {
  username: PropTypes.string,
  fullName: PropTypes.string,
}

User.whyDidYouRender = true
