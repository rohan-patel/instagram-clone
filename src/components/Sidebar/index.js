import useUser from '../../hooks/use-user'
import User from './user'
import Suggestion from './suggestion'

export default function Sidebar() {
  const {
    user: { docId, fullName, username, userId, following },
  } = useUser()

  return (
    <div className='p-4'>
      <User username={username} fullName={fullName} />
      <Suggestion userId={userId} following={following} loggedInUserDocId={docId} />
    </div>
  )
}

Sidebar.whyDidYouRender = true
