import { useState, useContext } from 'react'
import PropTypes from 'prop-types'
import FirebaseContext from '../../context/firebase'
import UserContext from '../../context/user'
import { getCommentsLength } from '../../services/firebase'

export default function AddComment({
  docId,
  comments,
  setComments,
  commentInput,
  photoId,
}) {
  const [comment, setComment] = useState('')
  const [commentLength, setCommentLength] = useState('')
  getCommentsLength(photoId).then((value) => setCommentLength(value))
  const [likes, setLikes] = useState([])
  const { firebase, FieldValue } = useContext(FirebaseContext)
  const {
    user: { displayName },
  } = useContext(UserContext)
  let commentId = commentLength.toString()

  const handleSubmitComment = (e) => {
    e.preventDefault()

    setComments([{ displayName, comment, likes, commentId }, ...comments])
    setComment('')

    return firebase
      .firestore()
      .collection('photos')
      .doc(docId)
      .update({
        comments: FieldValue.arrayUnion({
          displayName,
          comment,
          likes,
          commentId,
        }),
      })
  }
  return (
    <div className='border-t border-gray-primary'>
      <form
        className='flex justify-between pl-0 pr-5'
        method='POST'
        onSubmit={(e) =>
          comment.length >= 1 ? handleSubmitComment(e) : e.preventDefault()
        }
      >
        <input
          aria-label='Add a comment'
          autoComplete='off'
          className='text-sm text-gray-base w-full mr-3 py-6 px-4'
          type='text'
          name='add-comment'
          placeholder='Add a comment ...'
          value={comment}
          onChange={({ target }) => setComment(target.value)}
          ref={commentInput}
        />
        <button
          className={`text-sm font-bold text-blue-medium ${
            !comment && 'opacity-25'
          }`}
          type='button'
          disabled={comment.length < 1}
          onClick={handleSubmitComment}
        >
          Post
        </button>
      </form>
    </div>
  )
}

AddComment.propTypes = {
  docId: PropTypes.string.isRequired,
  comments: PropTypes.array.isRequired,
  setComments: PropTypes.func.isRequired,
  commentInput: PropTypes.object.isRequired,
}
