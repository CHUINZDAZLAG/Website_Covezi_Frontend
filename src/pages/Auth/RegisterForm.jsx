import { Link, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { Card as MuiCard } from '@mui/material'
import CardActions from '@mui/material/CardActions'
import TextField from '@mui/material/TextField'
import Zoom from '@mui/material/Zoom'
import { useForm } from 'react-hook-form'
import {
  EMAIL_RULE,
  PASSWORD_RULE,
  FIELD_REQUIRED_MESSAGE,
  PASSWORD_RULE_MESSAGE,
  EMAIL_RULE_MESSAGE
} from '~/utils/validators'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { registerUserAPI, verifyUserPINAPI } from '~/apis'
import { toast } from 'react-toastify'
import { useState } from 'react'

function RegisterForm() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm()
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // Step 1: Email/Password, Step 2: PIN
  const [registrationData, setRegistrationData] = useState({
    email: '',
    password: '',
    registerVerificationToken: ''
  })

  const submitRegister = (data) => {
    const { email, password } = data
    toast.promise(
      registerUserAPI({ email, password }),
      { pending: 'Gửi mã PIN đến email của bạn...' }
    ).then(response => {
      setRegistrationData({
        email: response.email,
        password,
        registerVerificationToken: response.registerVerificationToken
      })
      setStep(2)
      toast.success('Mã PIN đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư!', { theme: 'colored' })
    }).catch(() => {
      // Error toast is shown by the API interceptor
    })
  }

  const submitPINVerification = (data) => {
    const pinData = {
      email: registrationData.email,
      pin: data.pin,
      registerVerificationToken: registrationData.registerVerificationToken
    }

    toast.promise(
      verifyUserPINAPI(pinData),
      { pending: 'Xác thực mã PIN...' }
    ).then(() => {
      navigate(`/login?verifiedEmail=${registrationData.email}`)
    }).catch(() => {
      // Error toast is shown by the API interceptor
    })
  }

  return (
    <>
      {step === 1 ? (
        <form onSubmit={handleSubmit(submitRegister)}>
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
                  Tạo tài khoản<br />mới
                </Typography>
              </Box>

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
                <Box sx={{ marginTop: '0.8em' }}>
                  <TextField
                    fullWidth
                    placeholder="Confirm Password"
                    type="password"
                    variant="outlined"
                    error={!!errors['password_confirmation']}
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
                    {...register('password_confirmation', {
                      validate: (value) => {
                        if (value === watch('password')) return true
                        return 'Confirmation password incorrect!'
                      }
                    })}
                  />
                  <FieldErrorAlert errors={errors} fieldName={'password_confirmation'} />
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
                  Tiếp tục
                </Button>
              </CardActions>

              {/* Sign In Link */}
              <Box sx={{
                padding: '0 1.2em 1.5em 1.2em',
                textAlign: 'center'
              }}>
                <Typography sx={{ fontSize: '0.85rem', color: '#666' }}>
                  Already Have An Account?{' '}
                  <Link to="/login" style={{ textDecoration: 'none' }}>
                    <Typography component="span" sx={{
                      color: '#2c5f6f',
                      fontWeight: '600',
                      cursor: 'pointer',
                      '&:hover': {
                        textDecoration: 'underline',
                        color: '#1f4452'
                      }
                    }}>
                      Sign In
                    </Typography>
                  </Link>
                </Typography>
              </Box>
            </MuiCard>
          </Zoom>
        </form>
      ) : (
        <form onSubmit={handleSubmit(submitPINVerification)}>
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
                  Xác nhận<br />mã PIN
                </Typography>
                <Typography sx={{
                  fontSize: '0.9rem',
                  color: '#666',
                  marginTop: '0.5em'
                }}>
                  Chúng tôi đã gửi mã PIN 6 số đến email<br />{registrationData.email}
                </Typography>
              </Box>

              {/* PIN Input */}
              <Box sx={{ padding: '0 1.2em 1.2em 1.2em' }}>
                <TextField
                  autoFocus
                  fullWidth
                  placeholder="Nhập mã PIN (6 số)"
                  type="text"
                  variant="outlined"
                  inputProps={{
                    maxLength: 6,
                    pattern: '[0-9]*'
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      backgroundColor: '#f8f8f8',
                      fontSize: '1rem',
                      letterSpacing: '0.5em',
                      textAlign: 'center'
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#e5e5e5'
                    }
                  }}
                  {...register('pin', {
                    required: 'Vui lòng nhập mã PIN',
                    pattern: {
                      value: /^\d{6}$/,
                      message: 'Mã PIN phải là 6 chữ số'
                    }
                  })}
                />
                <FieldErrorAlert errors={errors} fieldName={'pin'} />
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
                  Xác nhận
                </Button>
              </CardActions>

              {/* Back Button */}
              <Box sx={{
                padding: '0 1.2em 1.5em 1.2em',
                textAlign: 'center'
              }}>
                <Button
                  variant="text"
                  size="small"
                  onClick={() => setStep(1)}
                  sx={{
                    color: '#2c5f6f',
                    textTransform: 'none',
                    fontSize: '0.9rem',
                    '&:hover': {
                      backgroundColor: '#f0f0f0'
                    }
                  }}
                >
                  ← Quay lại
                </Button>
              </Box>
            </MuiCard>
          </Zoom>
        </form>
      )}
    </>
  )
}

export default RegisterForm
