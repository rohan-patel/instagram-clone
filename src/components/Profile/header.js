import PropTypes from 'prop-types'
import { useEffect, useState, useRef } from 'react'
import Skeleton from 'react-loading-skeleton'
import useUser from '../../hooks/use-user'
import { isUserFollowingProfile, toggleFollow } from '../../services/firebase'
import { getStorage, ref, getDownloadURL } from 'firebase/storage'
import * as LINKS from '../../constants/links'
import Cropper from 'react-easy-crop'
import { Slider, Button } from '@material-ui/core'
import ProfilePicture from './ProfilePicture'

export default function Header({
  photosCount,
  profile: {
    docId: profileDocId,
    userId: profileUserId,
    fullName,
    followers,
    following,
    username: profileUsername,
  },
  followerCount,
  setFollowerCount,
  hasProfileImageChanged,
  setHasProfileImageChanged
}) {
  const inputRef = useRef()
  const triggerFileSelectPopUp = () => inputRef.current.click()

  const [image, setImage] = useState(null)
  const [croppedArea, setCroppedArea] = useState(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)

  const { user } = useUser()
  const [isSettingDP, setIsSettingDP] = useState(false)
  const [isFollowingProfile, setIsFollowingProfile] = useState(false)
  const activeBtnFollow = user?.username && user?.username !== profileUsername

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

  const onCropComplete = (croppedArePercentage, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels)
  }

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader()
      reader.readAsDataURL(e.target.files[0])
      reader.addEventListener('load', () => {
        setImage(reader.result)
      })
    }
  }

  const onDownload = () => {}

  const handleToggleFollow = async () => {
    setIsFollowingProfile(!isFollowingProfile)
    setFollowerCount({
      followerCount: isFollowingProfile ? followerCount - 1 : followerCount + 1,
    })
    await toggleFollow(
      isFollowingProfile,
      user.docId,
      profileDocId,
      profileUserId,
      user.userId
    )
    // console.log('followerCount', followerCount)
  }

  useEffect(() => {
    const isLoggedInUserFollowingProfile = async () => {
      const isFollowing = await isUserFollowingProfile(
        user.username,
        profileUserId
      )
      console.log('isFollowing', isFollowing)
      setIsFollowingProfile(isFollowing)
      console.log('isFollowingProfile', isFollowingProfile)
    }
    if (user.username && profileUserId) {
      isLoggedInUserFollowingProfile()
    }
  }, [user.username, profileUserId])

  return (
    <div className='grid grid-cols-3 gap-4 justify-between mx-auto max-w-screen-lg mt-24'>
      <div className='container flex justify-center'>
        {profileUsername && (
          // <img
          //   id={`profile-page-pic${profileUsername}`}
          //   className='rounded-full h-40 w-40 flex'
          //   src={LINKS.DEFAULT_PROFILE_PIC_URL}
          //   alt={`${profileUsername} profile picture`}
          //   onClick={() => setIsSettingDP(true)}
          // />
          <ProfilePicture
            profileUsername={profileUsername}
            hasProfileImageChanged={hasProfileImageChanged}
            setHasProfileImageChanged={setHasProfileImageChanged}
          />
        )}
      </div>
      <div className='flex items-center justify-center flex-col col-span-2'>
        <div className='container flex items-center'>
          <p className='text-2xl mr-4 '>{profileUsername}</p>
          {activeBtnFollow && (
            <button
              className='bg-blue-medium font-bold text-sm rounded text-white w-20 h-8'
              type='button'
              onClick={handleToggleFollow}
            >
              {isFollowingProfile ? 'Unfollow' : 'Follow'}
            </button>
          )}
        </div>
        <div className='container flex mt-4'>
          {followers === undefined || following === undefined ? (
            <Skeleton count={1} width={677} height={24} />
          ) : (
            <>
              <p className='mr-10'>
                <span className='font-bold'>{photosCount}</span>
                {` `}
                {photosCount === 1 ? `post` : `posts`}
              </p>
              <p className='mr-10'>
                <span className='font-bold'>{followerCount}</span>
                {` `}
                {followers.length === 1 ? `follower` : `followers`}
              </p>
              <p className='mr-10'>
                <span className='font-bold'>{following.length}</span>
                {` following`}
              </p>
            </>
          )}
        </div>
        <div className='container mt-4'>
          <p className='font-medium'>
            {!fullName ? <Skeleton count={1} height={24} /> : fullName}
          </p>
        </div>
      </div>
      {/* <div className='container h-screen w-screen'>
        <div className='h-[90%] p-3'>
          {image ? (
            <>
              <div className='h-[9/10] relative'>
                <Cropper
                  image={image}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>

              <div className='h-[1/10] flex items-center m-auto w-3/5'>
                <Slider
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e, zoom) => setZoom(zoom)}
                />
              </div>
            </>
          ) : null}
        </div>
      </div>
      {isSettingDP ? (
        <div className='container border-gray-border h-[1/10] flex items-center justify-center'>
          <input
            type='file'
            accept='image/*'
            ref={inputRef}
            onChange={onSelectFile}
            style={{ display: 'none' }}
          />
          <Button
            variant='contained'
            color='primary'
            onClick={() => setImage(null)}
            style={{ marginRight: '10px' }}
          >
            Clear
          </Button>
          <Button
            variant='contained'
            color='primary'
            onClick={triggerFileSelectPopUp}
            style={{ marginRight: '10px' }}
          >
            Choose
          </Button>
          <Button
            variant='contained'
            color='secondary'
            onClick={onDownload}
            style={{ marginRight: '10px' }}
          >
            Download
          </Button>
        </div>
      ) : null} */}
    </div>
  )
}

Header.propTypes = {
  photosCount: PropTypes.number.isRequired,
  followerCount: PropTypes.number.isRequired,
  setFollowerCount: PropTypes.func.isRequired,
  profile: PropTypes.shape({
    docId: PropTypes.string,
    userId: PropTypes.string,
    fullName: PropTypes.string,
    following: PropTypes.array,
  }).isRequired,
}
