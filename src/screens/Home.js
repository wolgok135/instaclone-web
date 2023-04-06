import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { logUserOut } from "../apollo";
import { gql, useQuery } from "@apollo/client";
import Avatar from "../components/Avatar";
import styled from "styled-components";
import { FatText } from "../components/shared";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark,
  faComment,
  faHeart,
  faPaperPlane,
} from "@fortawesome/free-regular-svg-icons";

import { faHeart as SolidHeart } from "@fortawesome/free-solid-svg-icons";

const FEED_QUERY = gql`
  query seeFeed {
    seeFeed {
      id
      user {
        userName
        avatar
      }
      file
      caption
      likes
      comments
      createdAt
      isMine
      isLiked
    }
  }
`;

const PhotoContainer = styled.div`
  background-color: white;
  border: 1px solid ${(props) => props.theme.borderColor};
  margin-bottom: 20px;
  max-width: 615px;
`;

const PhotoHeader = styled.div`
  padding: 15px;
  display: flex;
  align-items: center;
`;

const Username = styled(FatText)`
  margin-left: 15px;
`;

const PhotoFile = styled.img`
  min-width: 100%;
  max-width: 100%;
`;

const PhotoData = styled.div`
  padding: 15px;
`;

const PhotoActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  div {
    display: flex;
    align-items: center;
  }
  svg {
    font-size: 20px;
  }
`;
const PhotoAction = styled.div`
  margin-right: 10px;
`;

const Likes = styled(FatText)`
  margin-top: 10px;
  display: block;
`;

function Home() {
  const { data } = useQuery(FEED_QUERY);

  return (
    <div>
      {data?.seeFeed?.map((photo) => (
        <PhotoContainer key={photo.id}>
          <PhotoHeader>
            <Avatar url={photo.user.avatar} lg={true} />
            <Username>{photo.user.userName}</Username>
          </PhotoHeader>
          <PhotoFile src={photo.file} />
          <PhotoData>
            <PhotoActions>
              <div>
                <PhotoAction accent={true}>
                  <FontAwesomeIcon
                    style={{ color: photo.isLiked ? "tomato" : "inherit" }}
                    icon={photo.isLiked ? SolidHeart : faHeart}
                    size="2x"
                  />
                </PhotoAction>
                <PhotoAction>
                  <FontAwesomeIcon icon={faComment} size="2x" />
                </PhotoAction>
                <PhotoAction>
                  <FontAwesomeIcon icon={faPaperPlane} size="2x" />
                </PhotoAction>
              </div>
              <div>
                <FontAwesomeIcon icon={faBookmark} size="2x" />
              </div>
            </PhotoActions>
            <Likes>
              {photo.likes === 1 ? "1 like" : `${photo.likes} likes`}
            </Likes>
          </PhotoData>
        </PhotoContainer>
      ))}
    </div>
  );
}

export default Home;
