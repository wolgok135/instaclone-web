import styled from "styled-components";

const Title = styled.h1`
  color: ${(props) => props.theme.fontColor};
`;

const Container = styled.div`
  background-color: lightgray;
`;

function NotFound() {
  return (
    <Container>
      <Title>404 Not Found</Title>
    </Container>
  );
}

export default NotFound;
