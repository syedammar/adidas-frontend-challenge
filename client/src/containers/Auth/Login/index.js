import React, {Fragment} from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styled from 'styled-components';
import {useTranslation} from "react-i18next";
import useAuthContext from "../../../hooks/useAuthContext";
import {Navigate} from "react-router-dom";
import { SERVER_URL } from "../../../util/Constants";
// Styled-components styles
const CONTAINER = styled.div`
  background: #F7F9FA;
  height: auto;
  width: 90%;
  margin: 5em auto;
  -webkit-box-shadow: 5px 5px 5px 0px rgba(0, 0, 0, 0.4);
  -moz-box-shadow: 5px 5px 5px 0px rgba(0, 0, 0, 0.4);
  box-shadow: 5px 5px 5px 0px rgba(0, 0, 0, 0.4);

  label {
    color: #24B9B6;
    font-size: 1.2em;
    font-weight: 400;
  }

  .label-name {
    margin-bottom: .5rem;
    color: #000;
  }

  .form-control {
    display: block;
    visibility: unset;
    width: 100%;
    height: 40px;
    padding: 6px 12px;
    font-size: 14px;
    line-height: 1.42857143;
    color: #555;
    background-color: #fff;
    background-image: none;
    border: 1px solid #ccc;
    border-radius: 4px;
    -webkit-transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
    -o-transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
    -webkit-transition: border-color ease-in-out .15s,-webkit-box-shadow ease-in-out .15s;
    transition: border-color ease-in-out .15s,-webkit-box-shadow ease-in-out .15s;
    transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
    transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s,-webkit-box-shadow ease-in-out .15s; }
  
  .form-control:focus {
    color: #495057;
    background-color: #fff;
    border-color: #67B1E2;
    outline: 0;
    box-shadow: 0 0 0 0.1rem rgba(0, 123, 255, 0.25); }
  
  .form-control:hover {
    -webkit-box-shadow: inset 0px 2px 3px rgba(0, 0, 0, 0.075);
    box-shadow: inset 0px 2px 3px rgba(0, 0, 0, 0.075); }
  
  textarea.form-control, select.form-control[multiple], select.form-control[size] {
    height: auto;
    max-width: 100%; }
  
  .form-control option:checked {
    background-color: #c02032 !important;
    color: #FFF !important; }

  h1 {
    color: #24B9B6;
    padding-top: .5em;
  }

  .form-group {
    margin-bottom: 2.5em;
  }

  .error {
    border: 2px solid #FF6565;
  }

  .error-message {
    color: #FF6565;
    padding: .5em .2em;
    height: 1em;
    position: absolute;
    font-size: .8em;
  }

  .login-text {
    font-size: 24px;
    text-transform: uppercase;
    font-weight: 400;
    text-align: center;
  }

  .mb-6 {
    margin-bottom: 2rem;
  }

  .dIB {
    display: inline-block;
  }
  .mb05 {
      margin-bottom: .5rem;
  }
`;

const MYFORM = styled(Form)`
  width: 90%;
  text-align: left;
  padding-top: 2em;
  padding-bottom: 2em;
`;

const BUTTON = styled.button`
  background-color: #000;
  color: #fff;
  border: 1px solid #000;
  font-size: 1.2em;
  font-weight: 400;
  width: 100%;
  cursor: pointer;
  &:hover {
    background: #1D3461;
  }
`;

const loginUser = async (credentials) => {
  return fetch(SERVER_URL+'/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
  .then(data => data.json())
}

const Login = () => {
  const {t} = useTranslation('common');
  const { authTokens, setAuthTokens } = useAuthContext();

  if (authTokens) {
      return <Navigate to="/dashboard" />
  }
    return <CONTAINER>
        <Formik
            initialValues={{
                email:"", 
                password:""
            }}
            validationSchema={Yup.object().shape({
                email: Yup.string()
                    .email('Email is invalid')
                    .required('Email is required'),
                password: Yup.string()
                    .min(6, 'Password must be at least 6 characters')
                    .required('Password is required'),
            })}
            onSubmit={ async (values, {setSubmitting}) => {
                // When button submits form and form is in the process of submitting, submit button is disabled
                setSubmitting(true);
                const token = await loginUser(values);
                setAuthTokens(token);
            }}
        >
            {   ({  
                    errors,
                    touched,
                    handleSubmit,
                    isSubmitting 
                }) => 
                (
                  <Fragment>
                    <div className="login-text">{t('forms.log-in')}</div>
                    <MYFORM onSubmit={handleSubmit} className="mx-auto">                        
                        <div className="form-group mb-6">
                            <label htmlFor="email" className="label-name dIB">{t('forms.email')}</label>
                            <Field name="email" type="text" placeholder={t('forms.email-placeholder')} className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} />
                            <ErrorMessage name="email" component="div" className="Error-color" />
                        </div>
                        <div className="form-group mb-05" style={{position: "relative"}}>
                            <label htmlFor="password" className="label-name dIB">{t('forms.password')}</label>
                            <Field name="password" placeholder={t('forms.password-placeholder')} type="password" className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
                            <ErrorMessage name="password" component="div" className="Error-color" />
                        </div>
                        <BUTTON variant="primary" type="submit" disabled={isSubmitting}>
                          {t('forms.log-in')}
                        </BUTTON>
                    </MYFORM>
                  </Fragment>
                )
            }
        </Formik>
    </CONTAINER>
}

export default Login;