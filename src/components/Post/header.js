import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import { getStorage, ref, getDownloadURL } from 'firebase/storage'
import * as LINKS from '../../constants/links'

export default function Header({username, docId}) {

  const storage = getStorage()
  // console.log(docId);
  getDownloadURL(ref(storage, `/Profile Pictures/${username}.jpg`)).then(
    (url) => {
      const img = document.getElementById('post-profile-pic' + `${username}` + `${docId}`)
      img.setAttribute('src', url)
    }
  )

  return (
    <div className='flex border-b border-gray-primary h-4 p-4 py-8'>
      <div className='flex items-center'>
        <Link to={`/p/${username}`} className='flex items-center'>
          <img id={`post-profile-pic${username}${docId}`} className='rounded-full h-8 w-8 flex mr-3' 
          src={LINKS.DEFAULT_PROFILE_PIC_URL}
          alt={`${username} profie pciture`} />
          <p className="font-bold">{username}</p>
        </Link>
      </div>
    </div>
  )
}

Header.propTypes = {
  username: PropTypes.string.isRequired
}
