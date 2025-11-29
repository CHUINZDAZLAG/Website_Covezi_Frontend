import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { Card as MuiCard } from '@mui/material'
import CardActions from '@mui/material/CardActions'
import TextField from '@mui/material/TextField'
import Zoom from '@mui/material/Zoom'
import Alert from '@mui/material/Alert'
import { useForm } from 'react-hook-form'
import {
  EMAIL_RULE,
  PASSWORD_RULE,
  FIELD_REQUIRED_MESSAGE,
  PASSWORD_RULE_MESSAGE,
  EMAIL_RULE_MESSAGE
} from '~/utils/validators'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { useDispatch } from 'react-redux'
import { loginUserAPI } from '~/redux/user/userSlice'
import { toast } from 'react-toastify'

function LoginForm() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm()
  let [searchParams] = useSearchParams()
  const registeredEmail = searchParams.get('registeredEmail')
  const verifiedEmail = searchParams.get('verifiedEmail')

  const submitLogIn = (data) => {
    const { email, password } = data
    toast.promise(
      dispatch(loginUserAPI({ email, password })),
      { pending: 'Logging in...' }
    ).then(res => {
      console.log('Login response:', res) // Debug log
      console.log('Token in localStorage:', localStorage.getItem('accessToken')) // Debug log
      // Check if there is no error then redirect route /
      if (!res.error) navigate('/')
    })
  }

  return (
    <form onSubmit={handleSubmit(submitLogIn)}>
      <Zoom in={true} style={{ transitionDelay: '200ms' }}>
        <MuiCard sx={{
          minWidth: 380,
          maxWidth: 380,
          marginTop: '6em',
          borderRadius: '20px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
          background: 'rgba(255, 255, 255, 0.95)'
        }}>
          {/* Title */}
          <Box sx={{
            padding: '2em 1em 1.5em 1em',
            textAlign: 'center'
          }}>
            <Typography variant="h4" sx={{
              fontWeight: 'bold',
              color: '#2c5f6f',
              fontSize: '1.6rem',
              lineHeight: '1.4'
            }}>
              Rất vui được gặp<br />lại bạn
            </Typography>
          </Box>

          {/* Alerts */}
          {(verifiedEmail || registeredEmail) && (
            <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              padding: '0 1em 1em 1em'
            }}>
              {verifiedEmail &&
                <Alert severity="success" sx={{ '.MuiAlert-message': { overflow: 'hidden' } }}>
                  Your email&nbsp;
                  <Typography variant="span" sx={{ fontWeight: 'bold', '&:hover': { color: '#fdba26' } }}>{verifiedEmail}</Typography>
                  &nbsp;has been verified.<br />Now you can login to enjoy our services! Have a good day!
                </Alert>
              }
              {registeredEmail &&
                <Alert severity="info" sx={{ '.MuiAlert-message': { overflow: 'hidden' } }}>
                  An email has been sent to&nbsp;
                  <Typography variant="span" sx={{ fontWeight: 'bold', '&:hover': { color: '#fdba26' } }}>{registeredEmail}</Typography>
                  <br />Please check and verify your account before logging in!
                </Alert>
              }
            </Box>
          )}

          {/* Form Fields */}
          <Box sx={{ padding: '0 1.2em 1.2em 1.2em' }}>
            <Box sx={{ marginTop: '0.5em' }}>
              <TextField
                autoFocus
                fullWidth
                placeholder="Email Address"
                type="text"
                variant="outlined"
                error={!!errors['email']}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: '#f8f8f8',
                    fontSize: '0.9rem'
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e5e5e5'
                  }
                }}
                {...register('email', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: {
                    value: EMAIL_RULE,
                    message: EMAIL_RULE_MESSAGE
                  }
                })}
              />
              <FieldErrorAlert errors={errors} fieldName={'email'} />
            </Box>
            <Box sx={{ marginTop: '0.8em' }}>
              <TextField
                fullWidth
                placeholder="Password"
                type="password"
                variant="outlined"
                error={!!errors['password']}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: '#f8f8f8',
                    fontSize: '0.9rem'
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e5e5e5'
                  }
                }}
                {...register('password', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: {
                    value: PASSWORD_RULE,
                    message: PASSWORD_RULE_MESSAGE
                  }
                })}
              />
              <FieldErrorAlert errors={errors} fieldName={'password'} />
            </Box>
          </Box>

          {/* Submit Button */}
          <CardActions sx={{ padding: '0 1.2em 1em 1.2em' }}>
            <Button
              className='interceptor-loading'
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              sx={{
                backgroundColor: '#2c5f6f',
                color: 'white',
                borderRadius: '10px',
                padding: '0.75em 0',
                fontSize: '1rem',
                fontWeight: '600',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#1f4452'
                }
              }}
            >
              Sign In
            </Button>
          </CardActions>

          {/* Sign Up Link */}
          <Box sx={{
            padding: '0 1.2em 1.5em 1.2em',
            textAlign: 'center'
          }}>
            <Typography sx={{ fontSize: '0.85rem', color: '#666' }}>
              Dont Have An Account?{' '}
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <Typography component="span" sx={{
                  color: '#2c5f6f',
                  fontWeight: '600',
                  cursor: 'pointer',
                  '&:hover': {
                    textDecoration: 'underline',
                    color: '#1f4452'
                  }
                }}>
                  Sign Up
                </Typography>
              </Link>
            </Typography>
          </Box>
        </MuiCard>
      </Zoom>
    </form>
  )
}

export default LoginForm
