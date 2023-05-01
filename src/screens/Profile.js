import { useParams } from "react-router-dom/cjs/react-router-dom.min";

function Profile() {
  const params = useParams();
  console.log(params);
  return "Profile";
}

export default Profile;
