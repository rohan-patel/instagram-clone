import { firebase, FieldValue, storage } from './../lib/firebase'
import { getDocs } from 'firebase/firestore'

export async function doesUsernameExists(username) {
  const result = await firebase
    .firestore()
    .collection('users')
    .where('username', '==', username)
    .get()

  return result.docs.map((user) => user.data().length > 0)
}

export async function getUserByUsername(username) {
  const result = await firebase
    .firestore()
    .collection('users')
    .where('username', '==', username)
    .get()

  return result.docs.map((item) => ({
    ...item.data(),
    docId: item.id,
  }))
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

// export async function getUserIdByUsername(username) {
//   const result = firebase
//     .firestore()
//     .collection('users')
// }

export async function getUserPhotosByUserId(userId) {
  const result = await firebase
    .firestore()
    .collection('photos')
    .where('userId', '==', userId)
    .get()

  return result.docs.map((photo) => ({
    ...photo.data(),
    docId: photo.id,
  }))
}

export async function isUserFollowingProfile(
  loggedInUserUsername,
  profileUserId
) {
  console.log('profileUserId', profileUserId)
  console.log('loggedInUserUsername', loggedInUserUsername)
  const result = firebase
    .firestore()
    .collection('users')
    .where('username', '==', loggedInUserUsername)
  // .where('following', 'array-contains', 'profileUserId')

  // console.log('result', result);

  const querySnapshot = await getDocs(result)
  // console.log('querySnapshot', querySnapshot)
  let isUserFollowing = false
  querySnapshot.forEach((item) => {
    // console.log('item', item);
    const following = item.data().following
    isUserFollowing = following.includes(profileUserId)
  })
  return isUserFollowing
}

export async function toggleFollow(
  isFollowingProfile,
  activeUserDocId,
  profileDocId,
  profileUserId,
  followingUserId
) {
  await updateLoggedInUserFollowing(activeUserDocId, profileUserId, isFollowingProfile)
  await updatefollowedUserFollowers(profileDocId, followingUserId, isFollowingProfile)
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

export async function getCommentsLength(photoId) {
  const result = firebase
    .firestore()
    .collection('photos')
    .where('photoId', '==', photoId)

  let commentsLength = 0
  const querySnapshot = await getDocs(result)
  querySnapshot.forEach((doc) => {
    const comments = doc.data().comments
    commentsLength = comments.length
  })
  return commentsLength
}
