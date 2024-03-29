import PropTypes from 'prop-types'
import Skeleton from 'react-loading-skeleton'
// import {}

export default function Photos({ photos }) {
  return (
    <div className='h-16 border-t border-gray-primary mt-12 pt-4'>
      <div className='grid grid-cols-3 gap-8 mt-4 mb-12'>
        {!photos ? (
          <>
            <Skeleton count={12} width={320} height={400} />
          </>
        ) : photos.length > 0 ? (
          photos.map((photo) => (
            <div key={photo.docId} className='relative group'>
              <img src={photo.imageSrc} alt={photo.caption} />
              <div className='absolute bottom-0 left-0 bg-gray-200 z-10 w-full justify-evenly items-center h-full bg-black-faded group-hover:flex hidden'>
                <p className='flex items-center text-white font-bold'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                    className='w-8 mr-4'
                  >
                    <path
                      fillRule='evenodd'
                      d='M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z'
                      clipRule='evenodd'
                    />
                  </svg>
                  {photo.likes.length}
                </p>
                <p className='flex items-center text-white font-bold'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 11 11'
                    fill='currentColor'
                    // stroke='currentColor'
                    className='w-7 mr-4'
                  >
                    <path
                      fillRule='evenodd'
                      // strokeWidth={1.25}
                      d='M13.06,13.27l-.69-2.89A4.91,4.91,0,0,0,13,8a5,5,0,1,0-5,5,4.9,4.9,0,0,0,2.37-.63Z'
                      clipRule='evenodd'
                      transform='translate(-2.63 -2.63)'
                    />
                  </svg>
                  {photo.comments.length}
                </p>
              </div>
            </div>
          ))
        ) : null}
      </div>
      {!photos ||
        (photos.length === 0 && (
          <p className='text-center text-2xl'>No Posts Yet</p>
        ))}
    </div>
  )
}

Photos.propTypes = {
  photos: PropTypes.array.isRequired,
}
