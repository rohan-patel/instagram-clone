import { firebase, FieldValue, storage } from './../lib/firebase'
import { getDocs } from 'firebase/firestore'

export async function doesUsernameExists(username) {
  const result = await firebase
    .firestore()
    .collection('users')
    .where('username', '==', username)
    .get()

  console.log(result)

  return result.docs.map((user) => user.data().length > 0)
}

export async function getUserByUserId(userId) {
  const result = await firebase
    .firestore()
    .collection('users')
    .where('userId', '==', userId)
    .get()

  const user = result.docs.map((item) => ({
    ...item.data(),
    docId: item.id,
  }))

  return user
}

export async function getSuggestedProfiles(userId, following) {
  const result = await firebase.firestore().collection('users').limit(10).get()

  return result.docs
    .map((user) => ({
      ...user.data(),
      docId: user.id,
    }))
    .filter(
      (profile) =>
        profile.userId !== userId && !following.includes(profile.userId)
    )
}

export async function updateLoggedInUserFollowing(
  loggedInUserDocId,
  profileId,
  isFollowingProfile
) {
  return firebase
    .firestore()
    .collection('users')
    .doc(loggedInUserDocId)
    .update({
      following: isFollowingProfile
        ? FieldValue.arrayRemove(profileId)
        : FieldValue.arrayUnion(profileId),
    })
}

export async function updatefollowedUserFollowers(
  profileDocId,
  loggedInUserId,
  isBeingFollowed
) {
  return firebase
    .firestore()
    .collection('users')
    .doc(profileDocId)
    .update({
      followers: isBeingFollowed
        ? FieldValue.arrayRemove(loggedInUserId)
        : FieldValue.arrayUnion(loggedInUserId),
    })
}

export async function getPhotos(userId, following) {
  const result = await firebase
    .firestore()
    .collection('photos')
    .where('userId', 'in', following)
    .get()

  const userFollowedPhotos = result.docs.map((photo) => ({
    ...photo.data(),
    docId: photo.id,
  }))

  // console.log('ufp', userFollowedPhotos);

  const photosWithUserDetails = await Promise.all(
    userFollowedPhotos.map(async (photo) => {
      let userLikedPhoto = false
      if (photo.likes.includes(userId)) {
        userLikedPhoto = true
      }
      const user = await getUserByUserId(photo.userId)
      const { username } = user[0]

      return { username, ...photo, userLikedPhoto }
    })
  )

  return photosWithUserDetails
}

export async function getComment(photoId, index, userId) {
  const result = firebase
    .firestore()
    .collection('photos')
    .where('photoId', '==', photoId)

  const querySnapshot = await getDocs(result)
  let likedCommentArr = []
  querySnapshot.forEach((doc) => {
    const comments = doc.data().comments
    const likedComment = comments[index]

    let usersLikedComment = likedComment.likes
    let userLikedComment = usersLikedComment.includes(userId)
    
    likedCommentArr.push(userLikedComment)
  })
  return likedCommentArr
}
