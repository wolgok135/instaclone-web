import { logUserOut } from "../apollo";

function Home() {
  return (
    <div>
      <h1>home</h1>
      <button
        onClick={() => {
          logUserOut();
        }}
      >
        logout now
      </button>
    </div>
  );
}

export default Home;
