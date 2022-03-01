import Cropper from 'react-easy-crop'
import { Slider, Button } from '@material-ui/core'

export default function RenderCroppe() {
  const inputRef = useRef()
  const triggerFileSelectPopUp = () => inputRef.current.click()

  const [image, setImage] = useState(null)
  const [croppedArea, setCroppedArea] = useState(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)

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

  return (
    <div className='container h-screen w-screen'>
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
    </div>
  )
}
