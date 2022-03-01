import { useState, useContext } from 'react'
import { useRef } from 'react'
import ReactDom from 'react-dom'
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} from 'firebase/storage'
import UserContext from '../../../context/user'
import { useEffect } from 'react'

export const Modal = ({ setShowModal }) => {
  const { user } = useContext(UserContext)
  const storage = getStorage()
  const [fileUploaded, setFileUploaded] = useState(null)
  const modalRef = useRef()

  const closeModal = (e) => {
    if (e.target === modalRef.current) {
      setShowModal(false)
    }
  }
  const fileInput = useRef(null)

  const handleClick = (e) => {
    fileInput.current.click()
  }

  useEffect(() => {
    uploadProfilePhoto(fileUploaded)
  }, [fileUploaded])

  const handleChange = (e) => {
    setFileUploaded(e.target.files[0])
  }

  const uploadProfilePhoto = (file) => {
    if (file !== null) {
      const storageRef = ref(
        storage,
        `Profile Pictures/${user.displayName}.jpg`
      )
      const uploadTask = uploadBytesResumable(storageRef, file)

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const prog = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          )
          console.log('prog', prog)
        },
        (err) => console.log(err),
        () => {
          setShowModal(false)
        }
      )
    }
  }

  const removePicture = () => {
    const storage = getStorage()
    const desertRef = ref(storage, `Profile Pictures/${user.displayName}.jpg`)
    console.log(desertRef);
    deleteObject(desertRef).then(() => {
      console.log('Success');
      setShowModal(false)
    }).catch((error) => console.log(error))
  }

  return ReactDom.createPortal(
    <div
      className='container fixed top-0 bottom-0 left-0 right-0 h-screen flex items-center justify-center bg-black-bg'
      ref={modalRef}
      onClick={closeModal}
    >
      <div
        className='h-56 rounded-2xl bg-gray-background items-center flex flex-col'
        style={{ width: '400px' }}
      >
        <div className='w-full text-center'>
          <p className='text-lg mt-8 mb-4'>Change Profile Picture</p>
        </div>

        <div className='w-full flex flex-col items-center content-between'>
          <div className='w-full border-t text-center border-gray-primary'>
            <input
              type='file'
              accept='image/jpeg, image/png'
              ref={fileInput}
              style={{ display: 'none' }}
              onChange={handleChange}
            />
            <button
              className='text-sm text-blue-medium  font-bold mt-2 mb-1 pt-2 pb-2'
              onClick={handleClick}
            >
              Upload Photo
            </button>
          </div>
          <div className='w-full border-t border-gray-primary text-center'>
            <button
              className='text-sm text-red-primary font-bold mt-2 mb-1 pt-2 pb-2'
              onClick={() => removePicture()}
            >
              Remove Current Photo
            </button>
          </div>
          <div className='w-full border-t border-gray-primary text-center'>
            <button
              className='text-sm text-gray-base mt-2 mb-1 pt-2 pb-2'
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById('dpmodal')
  )
}
