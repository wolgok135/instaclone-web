import {
  faFacebookSquare,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styled from "styled-components";
import routes from "../routes";

import AuthLayout from "../components/auth/AuthLayout";
import Button from "../components/auth/Button";
import Separator from "../components/auth/Separator";
import Input from "../components/auth/Input";
import FormBox from "../components/auth/FormBox";
import BottomBox from "../components/auth/BottomBox";

import PageTitle from "../components/PageTitle";
import { useForm } from "react-hook-form";
import FormError from "../components/auth/FormError";
import { gql, useMutation } from "@apollo/client";
import { logUserIn } from "../apollo";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

const FacebookLogin = styled.div`
  color: #40588a;
  span {
    margin-left: 10px;
    font-weight: 600;
  }
`;

const Location = styled.div`
  color: #2ecc71;
`;

const LOGIN_MUTATION = gql`
  mutation login($userName: String!, $password: String!) {
    login(userName: $userName, password: $password) {
      ok
      token
      error
    }
  }
`;

function Login() {
  const location = useLocation();

  //const { register, watch } = useForm();
  //console.log("watch", watch());
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
    setError,
    clearErrors,
  } = useForm({
    //mode: "onBlur",
    mode: "onChange",
    defaultValues: {
      userName: location?.state?.userName,
      password: location?.state?.password,
    },
  });

  const onCompleted = (data) => {
    const {
      login: { ok, error, token },
    } = data;
    if (!ok) {
      return setError("result", { message: error });
    }
    if (token) {
      logUserIn(token);
    }
  };
  const [login, { loading }] = useMutation(LOGIN_MUTATION, {
    onCompleted,
  });
  const onSubmitValid = (data) => {
    //console.log("valid", data);
    if (loading) {
      return;
    }
    const { userName, password } = getValues();

    login({
      variables: { userName: userName, password: password },
    });
  };

  const clearLoginError = () => {
    clearErrors("result");
  };
  /*
  const onSubmitInvalid = (data) => {
    //console.log("invalid", data);
  };
*/

  return (
    <AuthLayout>
      <PageTitle title="Login" />
      <FormBox>
        <div>
          <FontAwesomeIcon icon={faInstagram} size="3x" />
        </div>
        <Location>{location?.state?.message}</Location>

        <form onSubmit={handleSubmit(onSubmitValid)}>
          <Input
            {...register("userName", {
              required: "username is required",
              minLength: {
                value: 5,
                message: "username should be longer than 5 characters",
              },
              //validate: (currentValue) => currentValue.includes("potato"),
            })}
            onFocus={clearLoginError}
            type="text"
            placeholder="Username"
            hasError={Boolean(errors?.userName?.message)}
          />
          <FormError message={errors?.userName?.message} />
          <Input
            {...register("password", { required: "password is required" })}
            onFocus={clearLoginError}
            type="password"
            placeholder="Password"
            hasError={Boolean(errors?.password?.message)}
          />
          <FormError message={errors?.password?.message} />

          <Button
            type="submit"
            value={loading ? "Loading..." : "Log in"}
            disabled={!isValid || loading}
          />
          <FormError message={errors?.result?.message} />
        </form>
        <Separator />
        <FacebookLogin>
          <FontAwesomeIcon icon={faFacebookSquare} />
          <span>Log in with Facebook</span>
        </FacebookLogin>
      </FormBox>

      <BottomBox
        cta="Don't have an account?"
        link={routes.signUp}
        linkText="Sign up"
      />
    </AuthLayout>
  );
}

export default Login;
