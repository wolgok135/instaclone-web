import { gql, useApolloClient, useMutation, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { PHOTO_FRAGMENT } from "../fragment";
import styled from "styled-components";
import { FatText } from "../components/shared";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faHeart } from "@fortawesome/free-regular-svg-icons";
import Button from "../components/auth/Button";
import PageTitle from "../components/PageTitle";
import useUser from "../hooks/useUser";

const FOLLOW_USER_MUTATION = gql`
  mutation followUser($userName: String!) {
    followUser(userName: $userName) {
      ok
      error
    }
  }
`;

const UNFOLLOW_USER_MUTATION = gql`
  mutation unfollowUser($userName: String!) {
    unfollowUser(userName: $userName) {
      ok
      error
    }
  }
`;

const SEE_PROFILE_QUERY = gql`
  query seeProfile($userName: String!) {
    seeProfile(userName: $userName) {
      firstName
      lastName
      userName
      avatar
      bio
      photos {
        ...PhotoFragment
      }
      totalFollowers
      totalFollowing
      isFollowing
      isMe
    }
  }
  ${PHOTO_FRAGMENT}
`;

const Header = styled.div`
  display: flex;
`;

const Avatar = styled.img`
  margin-left: 50px;
  height: 160px;
  width: 160px;
  border-radius: 50%;
  margin-right: 150px;
  background-color: #2c2c2c;
`;

const Column = styled.div``;

const Username = styled.h3`
  font-size: 28px;
  font-weight: 400;
`;

const Row = styled.div`
  margin-bottom: 20px;
  font-size: 16px;
  display: flex;
  align-items: center;
`;

const List = styled.ul`
  display: flex;
`;

const Item = styled.li`
  margin-right: 20px;
`;

const Value = styled(FatText)`
  font-size: 18px;
`;

const Name = styled(FatText)`
  font-size: 20px;
`;

const Grid = styled.div`
  display: grid;
  grid-auto-rows: 290px;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-top: 50px;
`;

const Photo = styled.div`
  background-image: url(${(props) => props.bg});
  position: relative;
  background-size: cover;
  //background-size: 100% 100%;
`;

const Icons = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  opacity: 0;
  &:hover {
    opacity: 1;
  }
`;

const Icon = styled.span`
  font-size: 18px;
  display: flex;
  align-items: center;
  margin: 0px 5px;
  svg {
    font-size: 14px;
    margin-right: 5px;
  }
`;

const ProfileBtn = styled(Button).attrs({
  as: "span",
})`
  border-radius: 5%;
  padding: 8px 15px;
  margin-left: 10px;
  margin-top: 0px;
  cursor: pointer;
`;

function Profile() {
  const { userName } = useParams();
  const { data: userData } = useUser();

  const client = useApolloClient(); //cache를 사용하기 위해 사용

  const { data, loading } = useQuery(SEE_PROFILE_QUERY, {
    variables: {
      userName: userName,
    },
  });

  const unfollowUserUpdate = (cache, result) => {
    console.log(result);
    const {
      data: {
        unfollowUser: { ok },
      },
    } = result;

    if (!ok) {
      return;
    }

    cache.modify({
      id: `User:${userName}`,
      fields: {
        //isFollowing: false,
        isFollowing(prev) {
          return false;
        },
        totalFollowers(prev) {
          return prev - 1;
        },
      },
    });

    const { me } = userData;

    cache.modify({
      id: `User:${me.userName}`,
      fields: {
        totalFollowing(prev) {
          return prev - 1;
        },
      },
    });
  };

  //onCompleted함수에서는 cache를 받아올 수 없지만,
  //apolloclient에서 언제든 cache에 접근할 수 있다는 예시를 보기 위해 onCompleted로 작성함
  //즉, mutation을 사용하지 않고도 cache에 접근 가능
  const followUserCompleted = (data) => {
    console.log(data);
    const {
      followUser: { ok },
    } = data;
    if (!ok) {
      return;
    }

    const { cache } = client;
    cache.modify({
      id: `User:${userName}`,
      fields: {
        //isFollowing: true,
        isFollowing(prev) {
          return true;
        },
        totalFollowers(prev) {
          return prev + 1;
        },
      },
    });

    const { me } = userData;

    cache.modify({
      id: `User:${me.userName}`,
      fields: {
        totalFollowing(prev) {
          return prev + 1;
        },
      },
    });
  };

  const [unfollowUser] = useMutation(UNFOLLOW_USER_MUTATION, {
    variables: {
      userName: userName,
    },
    update: unfollowUserUpdate,
    /*
    refetchQueries: [
      { query: SEE_PROFILE_QUERY, variables: { userName: userName } },
      {
        query: SEE_PROFILE_QUERY,
        variables: { userName: userData?.me?.userName },
      },
    ],
    */
  });

  const [followUser] = useMutation(FOLLOW_USER_MUTATION, {
    variables: {
      userName: userName,
    },
    onCompleted: followUserCompleted,
    /*
    refetchQueries: [
      { query: SEE_PROFILE_QUERY, variables: { userName: userName } },
      {
        query: SEE_PROFILE_QUERY,
        variables: { userName: userData?.me?.userName },
      },
    ],
    */
  });

  const getButton = (seeProfile) => {
    const { isMe, isFollowing } = seeProfile;
    if (isMe) {
      return <ProfileBtn>Edit Profile</ProfileBtn>;
    }
    if (isFollowing) {
      return <ProfileBtn onClick={unfollowUser}>Unfollow</ProfileBtn>;
    } else {
      return <ProfileBtn onClick={followUser}>Follow</ProfileBtn>;
    }
  };

  return (
    <div>
      <PageTitle
        title={
          loading ? "Loading..." : `${data?.seeProfile?.userName}님의 Profile`
        }
      />
      <Header>
        <Avatar src={data?.seeProfile?.avatar} />
        <Column>
          <Row>
            <Username>{data?.seeProfile?.userName}</Username>
            {data?.seeProfile ? getButton(data.seeProfile) : null}
          </Row>
          <Row>
            <List>
              <Item>
                <span>
                  <Value>{data?.seeProfile?.totalFollowers}</Value> followers
                </span>
              </Item>
              <Item>
                <span>
                  <Value>{data?.seeProfile?.totalFollowing}</Value> following
                </span>
              </Item>
            </List>
          </Row>

          <Row>
            <Name>
              {data?.seeProfile?.firstName} {data?.seeProfile?.lastName}
            </Name>
          </Row>
          <Row>{data?.seeProfile?.bio}</Row>
        </Column>
      </Header>
      <Grid>
        {data?.seeProfile?.photos.map((photo) => (
          <Photo bg={photo.file}>
            <Icons>
              <Icon>
                <FontAwesomeIcon icon={faHeart} />
                {photo.likes}
              </Icon>
              <Icon>
                <FontAwesomeIcon icon={faComment} />
                {photo.commentNumber}
              </Icon>
            </Icons>
          </Photo>
        ))}
      </Grid>
    </div>
  );
}

export default Profile;
