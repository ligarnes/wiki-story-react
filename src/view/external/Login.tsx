import React, {FunctionComponent, useState} from "react";
import LockIcon from '@mui/icons-material/Lock';
import AlertComponent, {
  emptyNotification,
  errorNotification,
  successNotification
} from "../../component/AlertComponent";
import {useHistory} from "react-router";
import {useRecoilValue} from "recoil";
import {serviceLocatorAtom} from "../../atom/ServiceLocatorAtom";
import {Avatar, Box, Button, Container, CssBaseline, Grid, Link, TextField, Typography} from "@mui/material";
import {useTheme} from '@mui/material/styles';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://nameofwind.com/">
        Wiki Story
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

/**
 * The login page
 * @constructor
 */
export const Login: FunctionComponent<unknown> = () => {
  const history = useHistory();
  const theme = useTheme();
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState(emptyNotification());

  const serviceLocator = useRecoilValue(serviceLocatorAtom);

  const login = (e: React.SyntheticEvent) => {
    e.preventDefault();
    serviceLocator?.loginService.login(username, password)
      .then(onLoginSuccess)
      .catch(() => setNotification(errorNotification('Login failed', 'Invalid username or password')));
  }

  const onLoginSuccess = () => {
    setNotification(successNotification('Login successful', 'You will be redirected soon.'));
    history.push('/my-wikis');
  }

  const changeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value)
  }

  const changePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline/>
      <Box sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <Avatar sx={{
          margin: 1,
          backgroundColor: theme.palette.secondary.main,
        }}>
          <LockIcon/>
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <AlertComponent notification={notification}/>
        <Box sx={{
          width: '100%', // Fix IE 11 issue.
          marginTop: theme.spacing(1),
        }}>
          <form onSubmit={login}>
            <TextField variant="outlined" margin="normal" required fullWidth id="email"
                       label="Email Address or username"
                       name="email" autoComplete="email" autoFocus value={username} onChange={changeUsername}/>
            <TextField variant="outlined" margin="normal" required fullWidth name="password"
                       label="Password" type="password" id="password" autoComplete="current-password"
                       value={password} onChange={changePassword}/>
            <Button type="submit" fullWidth variant="contained" color="primary" sx={{margin: theme.spacing(3, 0, 2),}}>
              Sign In
            </Button>
          </form>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/signin" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Box mt={8}>
        <Copyright/>
      </Box>
    </Container>
  );
}
