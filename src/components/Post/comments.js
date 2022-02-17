import { useState, useContext } from 'react'
import PropTypes from 'prop-types'
import { formatDistance } from 'date-fns'
import { Link } from 'react-router-dom'
import AddComment from './add-comments'
import FirebaseContext from '../../context/firebase'
import UserContext from '../../context/user'

export default function Comments({
  docId,
  comments: allComments,
  posted,
  commentInput,
}) {
  const {
    user: { uid: userId = '' },
  } = useContext(UserContext)
  const { firebase, FieldValue } = useContext(FirebaseContext)
  const [comments, setComments] = useState(allComments)
  const [commentToggleLiked, setCommentToggleLiked] = useState(false)

  const handleToggleCommentLike = async () => {
    setCommentToggleLiked(!commentToggleLiked)

    // await firebase
    //   .firestore()
    //   .collection('photos')
    //   .doc(docId)
    //   .update({
    //     'comments.likes': commentToggleLiked
    //       ? FieldValue.arrayUnion(userId)
    //       : FieldValue.arrayRemove(userId),
    //   })
  }

  return (
    <>
      <div className='p-4 pt-1 pb-4'>
        {comments.length >= 3 && (
          <p className='text-sm text-gray-base mb-1 cursor-pointer'>
            View all {comments.length} comments
          </p>
        )}
        {comments.slice(0, 3).map((item) => (
          <p
            key={`${item.comment}-${item.displayName}`}
            className='mb-1 flex justify-between'
          >
            <div>
              <Link to={`/p/${item.displayName}`}>
                <span className='mr-1 font-bold'>{item.displayName}</span>
              </Link>
              <span>{item.comment}</span>
            </div>

            <svg
              onClick={handleToggleCommentLike}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleToggleCommentLike()
                }
              }}
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              tabIndex={0}
              className={`w-4 select-none cursor-pointer focus:outline-none ${
                commentToggleLiked
                  ? 'fill-red text-red-primary'
                  : 'text-black-light'
              }`}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1}
                d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
              />
            </svg>
          </p>
        ))}
        <p className='text-gray-base uppercase text-xs mt-2'>
          {formatDistance(posted, new Date())} ago
        </p>
      </div>
      <AddComment
        docId={docId}
        comments={comments}
        setComments={setComments}
        commentInput={commentInput}
      />
    </>
  )
}

Comments.propTypes = {
  docId: PropTypes.string.isRequired,
  comments: PropTypes.array.isRequired,
  posted: PropTypes.number.isRequired,
  commentInput: PropTypes.object.isRequired,
}
