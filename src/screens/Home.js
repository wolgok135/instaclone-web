import { gql, useQuery } from "@apollo/client";

import Photo from "../components/feed/Photo";
import PageTitle from "../components/PageTitle";

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
      commentNumber
      comments {
        id
        user {
          userName
          avatar
        }
        payload
        isMine
        createdAt
      }
      createdAt
      isMine
      isLiked
    }
  }
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
