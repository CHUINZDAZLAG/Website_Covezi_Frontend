import { useState, useEffect } from 'react'
import { useSearchParams, Navigate } from 'react-router-dom'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import { verifyUserAPI } from '~/apis'

function AccountVerification() {
  // Get email and token from URL
  let [searchParms] = useSearchParams()
  // const email = searchParms.get('email')
  // const token = searchParms.get('token')
  const { email, token } = Object.fromEntries([...searchParms])

  // Create state to check if account has been verified
  const [verified, setVerified] = useState(false)

  // Call API to verify account
  useEffect(() => {
    if (email && token) {
      verifyUserAPI({ email, token }).then(() => setVerified(true))
    }
  }, [email, token])
  // If URL have problems, go to 404
  if (!email || !token) {
    return <Navigate to='/404'/>
  }

  // if verification has not been completed then show loading
  if (!verified) {
    return <PageLoadingSpinner caption="Verifying your account..." />
  }

  // If account verification is successful, return to login page with verifiedEmail value
  return <Navigate to={`/login?verifiedEmail=${email}`} />
}

export default AccountVerification