import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import routes from "../routes";

import AuthLayout from "../components/auth/AuthLayout";
import Button from "../components/auth/Button";

import Input from "../components/auth/Input";
import FormBox from "../components/auth/FormBox";
import BottomBox from "../components/auth/BottomBox";
import styled from "styled-components";
import { FatLink } from "../components/shared";

import PageTitle from "../components/PageTitle";
import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import FormError from "../components/auth/FormError";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Subtitle = styled(FatLink)`
  font-size: 16px;
  text-align: center;
  margin: 10px 0px;
`;

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccount(
    $firstName: String!
    $userName: String!
    $email: String!
    $password: String!
    $lastName: String
  ) {
    createAccount(
      firstName: $firstName
      userName: $userName
      email: $email
      password: $password
      lastName: $lastName
    ) {
      ok
      error
    }
  }
`;

function SignUp() {
  const history = useHistory();

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
  });

  const onCompleted = (data) => {
    const {
      createAccount: { ok, error },
    } = data;

    console.log(data);

    if (!ok) {
      return setError("result", { message: error });
    }
    if (error) {
      return console.log("error", error);
    }
    history.push(routes.home);
  };
  const onSubmitValid = (data) => {
    console.log("valid", data);
    if (loading) {
      return;
    }
    /*
    const { firstName, lastName, userName, password, email } = getValues();

    createAccount({
      variables: { firstName, lastName, userName, password, email },
    });
    */

    //위와 같이 해도 되고 간단히 아래 처럼 해도 됨.
    createAccount({
      variables: { ...data },
    });
  };

  const clearError = () => {
    clearErrors("result");
  };

  const [createAccount, { loading }] = useMutation(CREATE_ACCOUNT_MUTATION, {
    onCompleted,
  });

  return (
    <AuthLayout>
      <PageTitle title="Sign Up" />
      <FormBox>
        <HeaderContainer>
          <FontAwesomeIcon icon={faInstagram} size="3x" />
          <Subtitle>
            Sign up to see photos and videos from your friends.
          </Subtitle>
        </HeaderContainer>

        <form onSubmit={handleSubmit(onSubmitValid)}>
          <Input
            {...register("firstName", {
              required: "First name is required",
            })}
            type="text"
            onFocus={clearError}
            placeholder="First Name"
            hasError={Boolean(errors?.firstName?.message)}
          />
          <FormError message={errors?.firstName?.message} />

          <Input
            {...register("lastName")}
            type="text"
            placeholder="Last Name"
          />
          <Input
            {...register("userName", {
              required: "Username is required",
            })}
            onFocus={clearError}
            type="text"
            placeholder="User Name"
            hasError={Boolean(errors?.userName?.message)}
          />
          <FormError message={errors?.userName?.message} />
          <Input
            {...register("email", {
              required: "E-mail is required",
            })}
            onFocus={clearError}
            type="text"
            placeholder="E-Mail"
            hasError={Boolean(errors?.email?.message)}
          />
          <FormError message={errors?.email?.message} />
          <Input
            {...register("password", {
              required: "Password is required",
            })}
            onFocus={clearError}
            type="password"
            placeholder="Password"
            hasError={Boolean(errors?.password?.message)}
          />
          <FormError message={errors?.password?.message} />
          <Button
            type="submit"
            value={loading ? "Loading..." : "Sign Up"}
            disabled={!isValid || loading}
          />
          <FormError message={errors?.result?.message} />
        </form>
      </FormBox>

      <BottomBox cta="Have an account?" link={routes.home} linkText="Log in" />
    </AuthLayout>
  );
}

export default SignUp;
