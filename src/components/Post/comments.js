import { useState, useContext } from 'react'
import PropTypes from 'prop-types'
import { formatDistance } from 'date-fns'
import { Link } from 'react-router-dom'
import AddComment from './add-comments'
import FirebaseContext from '../../context/firebase'
import UserContext from '../../context/user'
import LikeComment from './like-comment'

export default function Comments({
  docId,
  comments: allComments,
  posted,
  commentInput,
  photoId,
}) {
  const {
    user: { uid: userId = '' },
  } = useContext(UserContext)
  const { firebase, FieldValue } = useContext(FirebaseContext)
  const [comments, setComments] = useState(allComments)

  return (
    <>
      <div className='p-4 pt-1 pb-4'>
        {comments.length >= 3 && (
          <p className='text-sm text-gray-base mb-1 cursor-pointer'>
            View all {comments.length} comments
          </p>
        )}
        {comments.slice(0, 3).map((item, index) => (
          <div
            key={`${item.comment}-${item.displayName}`}
            className='mb-1 flex justify-between'
          >
            <div>
              <Link to={`/p/${item.displayName}`}>
                <span className='mr-1 font-bold'>{item.displayName}</span>
              </Link>
              <span>{item.comment}</span>
            </div>

            <LikeComment
              userId={userId}
              item={item}
              docId={docId}
              photoId={photoId}
              index={index}
            />
          </div>
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
        photoId={photoId}
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
