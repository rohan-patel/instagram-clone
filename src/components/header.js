import { useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import FirebaseContext from '../context/firebase'
import UserContext from '../context/user'
import * as ROUTES from '../constants/routes'
import { getStorage, ref, getDownloadURL } from 'firebase/storage'
import * as LINKS from '../constants/links'
import { ReactComponent as HomeLogo } from '../svg/hut.svg'

export default function Header() {
  const { firebase } = useContext(FirebaseContext)
  const { user } = useContext(UserContext)
  let location = useLocation()
  let homeFill = 'none'
  if (location.pathname === '/') {
    homeFill = 'currentColor'
  }

  // console.log('location', location.pathname);

  const storage = getStorage()
  getDownloadURL(
    ref(storage, `/Profile Pictures/${user.displayName}.jpg`)
  ).then((url) => {
    const img = document.getElementById('header-user-profile-pic')
    img.setAttribute('src', url)
  })

  return (
    <nav className='h-16 bg-white border-b border-gray-primary mb-8 fixed top-0 left-0 right-0 z-1'>
      <div className='container mx-auto max-w-screen-lg h-full'>
        <div className='flex justify-between h-full'>
          <div className='text-gray-700 text-center flex items-center justify-center cursor-pointer'>
            <h1 className='flex justify-center w-full'>
              <Link to={ROUTES.DASHBOARD} aria-label='Instagram Logo'>
                <img
                  src='/images/logo.png'
                  alt='Instagram'
                  className='mt-2 w-6/12'
                />
              </Link>
            </h1>
          </div>
          <div className='text-gray-700 text-center flex items-center justify-center'>
            {user ? (
              <>
                <Link to={ROUTES.DASHBOARD} aria-label='Dashboard'>
                  <svg
                    className='w-6 mr-6 text-black-light cursor-pointer'
                    id='Layer_1'
                    data-name='Layer 1'
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 10.8 10.88'
                    fill={homeFill}
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='1'
                      d='M6.61,10.69l0,2.34H3V6.73L8,3l5,3.61V13H9.53V10.69C9.59,8.83,6.67,8.76,6.61,10.69Z'
                      transform='translate(-2.6 -2.56)'
                    />
                  </svg>
                </Link>
                <button
                  type='button'
                  title='Sign Out'
                  onClick={() => firebase.auth().signOut()}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      firebase.auth().signOut()
                    }
                  }}
                >
                  <svg
                    className='w-8 mr-6 text-black-light cursor-pointer'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={1.65}
                      d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
                    />
                  </svg>
                </button>
                <div className='flex items-center cursor-pointer'>
                  <Link to={`/p/${user.displayName}`}>
                    <img
                      className='rounded-full h-8 w-8'
                      id='header-user-profile-pic'
                      src={LINKS.DEFAULT_PROFILE_PIC_URL}
                      alt=''
                    />
                  </Link>
                </div>
              </>
            ) : (
              <>
                <Link to={ROUTES.LOGIN}>
                  <button
                    className='bg-blue-medium font-bold text-sm rounded text-white w-20 h-8'
                    type='button'
                  >
                    Log In
                  </button>
                </Link>
                <Link to={ROUTES.SIGNUP}>
                  <button
                    className='text-blue-medium font-bold text-sm rounded w-20 h-8'
                    type='button'
                  >
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
