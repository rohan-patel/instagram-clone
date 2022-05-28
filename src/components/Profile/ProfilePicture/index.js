import { getStorage, ref, getDownloadURL } from 'firebase/storage'
import { useState, useContext, useEffect } from 'react'
import UserContext from '../../../context/user'
import * as LINKS from '../../../constants/links'
import { Modal } from './modal'

export default function ProfilePicture({
  profileUsername,
  hasProfileImageChanged,
  setHasProfileImageChanged,
}) {
  const { user } = useContext(UserContext)
  const [showModal, setShowModal] = useState(false)
  // const [hasImageChanged, setHasImageChanged] = useState(true)

  const storage = getStorage()

  if (profileUsername) {
    getDownloadURL(
      ref(storage, `/Profile Pictures/${profileUsername}.jpg`)
    ).then((url) => {
      const img = document.getElementById(
        `profile-page-pic` + `${profileUsername}`
      )
      img.setAttribute('src', url)
    })
  }

  useEffect(() => {
    const img = document.getElementById(
      `profile-page-pic` + `${profileUsername}`
    )

    if (profileUsername) {
      getDownloadURL(ref(storage, `/Profile Pictures/${profileUsername}.jpg`))
        .then((url) => {
          console.log(url)
          img.setAttribute('src', url)
        })
        .catch((error) => {
          if (error.code === 'storage/object-not-found') {
            img.setAttribute('src', LINKS.DEFAULT_PROFILE_PIC_URL)
          }
        })
    }

    // img.setAttribute('src', LINKS.DEFAULT_PROFILE_PIC_URL)
  }, [hasProfileImageChanged])

  return (
    <>
      <img
        id={`profile-page-pic${profileUsername}`}
        className={`rounded-full h-40 w-40 flex ${
          user.displayName === profileUsername ? `cursor-pointer` : null
        }`}
        src={LINKS.DEFAULT_PROFILE_PIC_URL}
        alt={`${profileUsername} profile picture`}
        onClick={() => {
          if (user.displayName === profileUsername) {
            setShowModal(true)
          }
        }}
      />
      {showModal ? (
        <Modal
          setShowModal={setShowModal}
          setHasProfileImageChanged={setHasProfileImageChanged}
          hasProfileImageChanged={hasProfileImageChanged}
        />
      ) : null}
    </>
  )
}
