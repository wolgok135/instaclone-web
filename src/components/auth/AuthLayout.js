import { useReactiveVar } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styled from "styled-components";
import { darkModeVar, disableDarkMode, enableDarkMode } from "../../apollo";
import { faMoon, faSun } from "@fortawesome/free-regular-svg-icons";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
`;

const Wrapper = styled.div`
  max-width: 350px;
  width: 100%;
`;

const Footer = styled.footer`
  margin: 20px;
`;
const DarkModeBtn = styled.span`
  cursor: pointer;
`;
function AuthLayout({ children }) {
  const darkMode = useReactiveVar(darkModeVar);

  return (
    <Container>
      <Wrapper>{children}</Wrapper>
      <Footer>
        <DarkModeBtn onClick={darkMode ? disableDarkMode : enableDarkMode}>
          <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
        </DarkModeBtn>
      </Footer>
    </Container>
  );
}

export default AuthLayout;
