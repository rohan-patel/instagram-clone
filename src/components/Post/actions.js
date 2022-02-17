import { useState, useContext } from 'react'
import PropTypes from 'prop-types'
import FirebaseContext from '../../context/firebase'
import UserContext from '../../context/user'

export default function Actions({
  docId,
  totalLikes,
  likedPhoto,
  handleFocus,
}) {
  const {
    user: { uid: userId = '' },
  } = useContext(UserContext)
  const [toggleLiked, setToggleLiked] = useState(likedPhoto)
  const [likes, setLikes] = useState(totalLikes)
  const { firebase, FieldValue } = useContext(FirebaseContext)

  const handleToggleLike = async () => {
    setToggleLiked(!toggleLiked)

    await firebase
      .firestore()
      .collection('photos')
      .doc(docId)
      .update({
        likes: toggleLiked
          ? FieldValue.arrayRemove(userId)
          : FieldValue.arrayUnion(userId),
      })

    setLikes(() => (toggleLiked ? likes - 1 : likes + 1))
  }

  return (
    <>
      <div className='flex justify-between p-4'>
        <div className='flex'>
          <svg
            onClick={handleToggleLike}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleToggleLike()
              }
            }}
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            tabIndex={0}
            className={`w-8 mr-4 select-none cursor-pointer focus:outline-none ${
              toggleLiked ? 'fill-red text-red-primary' : 'text-black-light'
            }`}
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
            />
          </svg>
          {/* <svg
            onClick={handleFocus}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleFocus()
              }
            }}
            className='w-8 h-8 mr-4 text-black-light select-none cursor-pointer focus:outline-none'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            tabIndex={0}
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
            />
          </svg> */}
          <svg
            onClick={handleFocus}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleFocus()
              }
            }}
            className='w-6 text-black-light select-none cursor-pointer'
            id='Layer_1'
            data-name='Layer 1'
            xmlns='http://www.w3.org/2000/svg'
            // viewBox='0 0 10.81 11.02'
            viewBox='0 0 11 11'
            fill='none'
            stroke='currentColor'
            // display={block}
          >
            <path
              strokeLinejoin='round'
              strokeWidth={1.25}
              alignmentBaseline='central'
              d='M13.06,13.27l-.69-2.89A4.91,4.91,0,0,0,13,8a5,5,0,1,0-5,5,4.9,4.9,0,0,0,2.37-.63Z'
              transform='translate(-2.63 -2.63)'
            />
          </svg>
        </div>
      </div>
      <div className='p-4 py-0'>
        {likes !== 0 ? <p className='font-bold'>{likes === 1 ? `${likes} like` : `${likes} likes`}</p> : null }
      </div>
    </>
  )
}

Actions.propTypes = {
  docId: PropTypes.string.isRequired,
  totalLikes: PropTypes.number.isRequired,
  likedPhoto: PropTypes.bool.isRequired,
  handelFocus: PropTypes.func.isRequired,
}
