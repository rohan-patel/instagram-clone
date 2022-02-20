import PropTypes from 'prop-types'
import { Route, Navigate } from 'react-router-dom'
import * as ROUTES from '../constants/routes'

const IsUserLoggedIn = ({ user, children, redirectTo }) => {
  if (user) return <Navigate to={redirectTo} replace />

  return children
}

export default IsUserLoggedIn

IsUserLoggedIn.propTypes = {
  user: PropTypes.object,
  children: PropTypes.object.isRequired,
  redirectTo: PropTypes.string.isRequired,
}
