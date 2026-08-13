import { useState } from "react";

function LikeCounter() {
  const [likes, setLikes] = useState(0);

  function handleLike() {
    setLikes(likes + 1);
  }

  function handleReset() {
    setLikes(0);
  }

  return (
    <div>
      <h1>Like Button Application</h1>

      <h2>Likes: {likes}</h2>

      <button onClick={handleLike}>Like</button>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
}

export default LikeCounter;