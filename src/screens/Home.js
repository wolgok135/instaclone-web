import { isLoggedInVar } from "../apollo";

function Home() {
  return (
    <div>
      <h1>home</h1>
      <button
        onClick={() => {
          isLoggedInVar(false);
        }}
      >
        logout now
      </button>
    </div>
  );
}

export default Home;
