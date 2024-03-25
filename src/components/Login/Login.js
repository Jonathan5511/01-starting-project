import React, { useState, useEffect,useReducer,useContext } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import AuthContext from '../../store/auth-context';
import Input from '../UI/Input/Input';

const emailReducer = (state,action) =>{
  if(action.type==='USER_INPUT'){
    return {value: action.val,isValid: action.val.includes('@')}
  }
  if(action.type==='INPUT_BLUR'){
    return {value: state.value ,isValid: state.value.includes('@')}
  }
  return {value:'',isValid:false}
};

const passwordReducer = (state,action)=>{
  if(action.type==='USER_INPUT'){
    return {value: action.val,isValid: action.val.trim().length > 6}
  }
  if(action.type==='INPUT_BLUR'){
    return {value: state.value ,isValid: state.value.trim().length > 6}
  }
  return {value:'', isValid:false}
}

const Login = (props) => {
  // const [enteredEmail, setEnteredEmail] = useState('');
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState('');
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const [enteredCname, setEnteredCname] = useState('');
  const [cnameIsValid, setCnameIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, dispatchEmail]=useReducer(emailReducer,{value:'',isValid:false});
  const [passwordState, dispatchPassword]=useReducer(passwordReducer,{value:'', isValid:false});

  const authCtx=useContext(AuthContext);

  const{isValid: emailIsValid}=emailState;
  const{isValid: passwordIsValid}=passwordState;

  useEffect(()=>{
    const handler =setTimeout(()=>{
      setFormIsValid(
        emailIsValid && passwordIsValid && enteredCname.trim().length !==0
      );
    },500)

    return ()=>{
      clearTimeout(handler);
    };

  },[emailIsValid,passwordIsValid, enteredCname])

  const emailChangeHandler = (event) => {
    dispatchEmail({type:'USER_INPUT', val: event.target.value}) 
    
    // setFormIsValid(
    //       event.target.value.includes('@') && passwordState.isValid && enteredCname.trim().length !==0
    //     );

  };

  const passwordChangeHandler = (event) => {
    dispatchPassword({type:'USER_INPUT', val: event.target.value})

    // setFormIsValid(
    //   emailState.isValid && event.target.value.trim().length > 6 && enteredCname.trim().length !==0
    // );

  };

  const cnameChangeHandler = (event) => {
    setEnteredCname(event.target.value);

    // setFormIsValid(
    //   emailState.isValid && passwordState.isValid && event.target.value.trim().length !==0
    // );

  };

  const validateEmailHandler = () => {
    dispatchEmail({type: 'INPUT_BLUR'})
  };

  const validatePasswordHandler = () => {
    dispatchPassword({type: 'INPUT_BLUR'})
  };

  const validateCnameHandler = () => {
    setCnameIsValid(enteredCname.trim().length !== 0);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    authCtx.onLogin(emailState.value, passwordState.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input 
        id='email'
         label='E-Mail'
          type="email" 
          isValid={emailIsValid}
         value={emailState.value}
          onChange={emailChangeHandler}
           onBlur={validateEmailHandler}/>
        <Input
            id='password'
            label='Password'
            type="password"
            isValid={passwordIsValid}
             value={passwordState.value}
              onChange={passwordChangeHandler}
               onBlur={validatePasswordHandler}/>
        <div
          className={`${classes.control} ${
            cnameIsValid === false ? classes.invalid : ''
          }`}
        >
          <label htmlFor="cname">College Name:</label>
          <input
            type="text"
            id="cname"
            value={enteredCname}
            onChange={cnameChangeHandler}
            onBlur={validateCnameHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
