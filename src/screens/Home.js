import { gql, useQuery } from "@apollo/client";

import Photo from "../components/feed/Photo";
import PageTitle from "../components/PageTitle";
import { COMMENT_FRAGMENT, PHOTO_FRAGMENT } from "../fragment";

const FEED_QUERY = gql`
  query seeFeed {
    seeFeed {
      ...PhotoFragment
      user {
        userName
        avatar
      }
      caption
      comments {
        ...CommentFragment
      }
      createdAt
      isMine
    }
  }
  ${PHOTO_FRAGMENT}
  ${COMMENT_FRAGMENT}
`;

function Home() {
  const { data } = useQuery(FEED_QUERY);

  return (
    <div>
      <PageTitle title="Home" />
      {data?.seeFeed?.map((photo) => (
        /*
        <Photo
          key={photo.id}
          id={photo.id}
          user={photo.user}
          file={photo.file}
          isLiked={photo.isLiked}
          likes={photo.likes}
        />
        위처럼 해도 되지만 key value가 photo object와 같으니 아래처럼 하면 더 깔끔하게...
        */
        <Photo key={photo.id} {...photo} />
      ))}
    </div>
  );
}

export default Home;
