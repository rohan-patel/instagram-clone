import { getStorage, ref, getDownloadURL } from 'firebase/storage'
import { useState, useContext } from 'react'
import UserContext from '../../../context/user'
import * as LINKS from '../../../constants/links'
import { Modal } from './modal'

export default function ProfilePicture({ profileUsername }) {
  const { user } = useContext(UserContext)
  const [showModal, setShowModal] = useState(false)

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
      {showModal ? <Modal setShowModal={setShowModal} /> : null}
    </>
  )
}
