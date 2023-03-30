import styled from "styled-components";
import { BaseBox } from "../shared";
import { Link } from "react-router-dom";

const StyledBottomBox = styled(BaseBox)`
  padding: 20px 0px;
  text-align: center;
  a {
    margin-left: 5px;
    font-weight: 600;
    color: ${(props) => props.theme.accent};
  }
`;

function BottomBox({ cta, link, linkText }) {
  return (
    <StyledBottomBox>
      <span>{cta}</span>
      <Link to={link}>{linkText}</Link>
    </StyledBottomBox>
  );
}

export default BottomBox;
