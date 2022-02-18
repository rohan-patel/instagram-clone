import { useState, useContext } from 'react'
import FirebaseContext from '../../context/firebase'
import { getDocs } from 'firebase/firestore'
import { getComment } from '../../services/firebase'

export default function LikeComment({ userId, item, docId, photoId, index }) {
  const [toggleCommentLike, setToggleCommentLike] = useState(false)
  getComment(photoId, index, userId).then((value) => setToggleCommentLike(value[0]))
  const { firebase, FieldValue } = useContext(FirebaseContext)

  const handleToggleCommentLike = async () => {
    setToggleCommentLike(!toggleCommentLike)

    let datas = await firebase
      .firestore()
      .collection('photos')
      .where('photoId', '==', photoId)

    const querySnapshot = await getDocs(datas)
    querySnapshot.forEach((doc) => {
      const comments = doc.data().comments

      const likedComment = doc.data().comments[index]

      likedComment.likes = !toggleCommentLike
        ? [...likedComment.likes, userId]
        : likedComment.likes.filter(function (user) {
            return user !== userId
          })

      const updatedComments = comments.map((comment) =>
        comment.commentId !== likedComment.commentId ? comment : likedComment
      )

      firebase.firestore().collection('photos').doc(docId).update({
        comments: updatedComments,
      })
    })
  }

  return (
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
        toggleCommentLike ? 'fill-red text-red-primary' : 'text-black-light'
      }`}
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1}
        d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
      />
    </svg>
  )
}
