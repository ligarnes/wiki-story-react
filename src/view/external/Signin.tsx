import React, {FunctionComponent, useState} from "react";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  CssBaseline,
  FormControlLabel,
  Link,
  TextField,
  Typography
} from "@material-ui/core";
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import {makeStyles} from "@material-ui/core/styles";
import {getApplication} from "../../Application";
import {RegistrationError, RegistrationRequest} from "../../service/user/LoginService";
import AlertComponent, {
  emptyNotification,
  errorNotification,
  successNotification,
  waitingNotification
} from "../../component/AlertComponent";
import {useHistory} from "react-router";


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

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

/**
 * The dashboard layout component.
 * @constructor
 */
export const Signin: FunctionComponent<unknown> = () => {
  const classes = useStyles();

  const history = useHistory();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [notification, setNotification] = useState(emptyNotification());

  const registerSuccess = () => {
    setNotification(successNotification('Your user registration was successful', 'You may now log-in with the username you have chosen.'));
    history.push('/login');
  }

  const registerFailed = (e: any) => {
    const messages: string[] = []
    if (e instanceof RegistrationError) {
      messages.push(...(e as RegistrationError).getErrors())
    } else if (e instanceof Error) {
      messages.push((e as Error).message);
    }
    setNotification(errorNotification('There was some errors with your registration.', ...messages));
  }

  const register = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setNotification(waitingNotification('Loading', 'Completing your registration.'));

    const request: RegistrationRequest = {
      username: username,
      email: email,
      password: password,
      acceptTerms: acceptTerms
    };
    getApplication().serviceLocator.loginService.register(request)
      .then(registerSuccess)
      .catch(registerFailed);
  }


  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline/>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon/>
        </Avatar>
        <Typography component="h1" variant="h5">
          Create a new account
        </Typography>
        <AlertComponent notification={notification}/>
        <div className={classes.form}>
          <form onSubmit={register}>
            <TextField variant="outlined" margin="normal" required fullWidth id="username" label="Username"
                       name="username" autoComplete="username" autoFocus
                       value={username} onChange={e => setUsername(e.target.value)}/>
            <TextField variant="outlined" margin="normal" required fullWidth id="email" label="Email Address"
                       name="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)}/>
            <TextField variant="outlined" margin="normal" required fullWidth name="password"
                       label="Password" type="password" id="password" autoComplete="new-password"
                       value={password} onChange={e => setPassword(e.target.value)}/>
            <TextField variant="outlined" margin="normal" required fullWidth name="passwordRepeat"
                       label="Repeat you password" type="password" id="passwordRepeat" autoComplete="new-password"
                       value={repeatPassword} onChange={e => setRepeatPassword(e.target.value)}/>
            <FormControlLabel
              control={<Checkbox checked={acceptTerms} color="primary"
                                 onChange={e => setAcceptTerms(e.target.checked)}/>}
              label="I agree to the Terms and Conditions"/>
            <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
              Create a new account
            </Button>
          </form>
        </div>
      </div>
      <Box mt={8}>
        <Copyright/>
      </Box>
    </Container>
  );
}
