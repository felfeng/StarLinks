import React, { useState } from "react";

interface Actor {
  id: string;
  name: string;
}

interface Movie {
  id: number;
  title: string;
  actors: Actor[];
}

interface GridProps {
  actors: Actor[];
  gridSize: number;
  movies: Movie[];
}

const Grid: React.FC<GridProps> = ({ actors, gridSize, movies }) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [completedGroups, setCompletedGroups] = useState<string[][]>([]);
  const [mistakes, setMistakes] = useState(3); // can only make 3 mistakes

  const handleSelect = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((actorId) => actorId !== id));
    } else if (selected.length < 4) { // Only allow selection if less than 4 actors are selected
      setSelected([...selected, id]);
    }
  };

  const handleSubmitGroup = () => {
    if (selected.length === 4) {
      // Check if all selected actors are from the same movie
      const validMovie = movies.find(movie => 
        selected.every(actorId => 
          movie.actors.some(actor => actor.id === actorId)
        )
      );

      if (validMovie) {
        setCompletedGroups([...completedGroups, selected]);
        setSelected([]); // clear selection
        // Optional: Show which movie they were from
        alert(`Correct! These actors appeared in "${validMovie.title}"`);
      } else {
        setMistakes(mistakes - 1);
        if (mistakes <= 1) {
          alert("Game Over! You've run out of attempts.");
          // Handle game over logic here
          return;
        }
        alert("These actors didn't appear in the same movie! Try again.");
      }
    } else {
      alert("Groups must have exactly 4 actors!");
    }
  };

  const handleShuffle = () => {
    // Create a copy of the actors array and shuffle it
    const shuffledActors = [...actors].sort(() => Math.random() - 0.5);
    // You'll need to implement a way to update the actors array
    // This might require lifting state up to the parent component
    console.log("Shuffled actors:", shuffledActors);
  };

  const isCompleted = (id: string) =>
    completedGroups.some((group) => group.includes(id));

  return (
    <div className="grid-container max-w-2xl mx-auto">
      <div className={`grid grid-cols-4 gap-4 rounded-lg`}>
        {actors.map((actor) => (
          <div
            key={actor.id}
            className={`flex items-center justify-center text-center rounded-lg cursor-pointer aspect-[3/1.7] uppercase font-bold text-lg ${
              isCompleted(actor.id)
                ? "bg-green text-white" // completed group style
                : selected.includes(actor.id)
                ? "bg-orange text-black" // selected style
                : "bg-element text-white" // default style
            } ${
              selected.length >= 4 && !selected.includes(actor.id)
                ? "cursor-not-allowed opacity-50"
                : ""
            }`}
            onClick={() => !isCompleted(actor.id) && handleSelect(actor.id)}
          >
            {actor.name}
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4 text-white text-lg">
        Mistakes Remaining: {mistakes}
      </div>
      <div className="flex justify-center gap-4">
        <button
          className="submit-button mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center border-2 border-white"
          onClick={handleShuffle}
        >
          Shuffle
        </button>
        <button
          className={`submit-button mt-4 px-4 py-2 rounded-md flex items-center border-2 border-white ${
            selected.length === 4
              ? "bg-blue-500 hover:bg-blue-600 text-white"
              : "bg-gray-400 cursor-not-allowed text-gray-200"
          }`}
          onClick={handleSubmitGroup}
          disabled={selected.length !== 4}
        >
          Submit
        </button>
      </div>
      {/* Optional: Display completed groups */}
      {completedGroups.length > 0 && (
        <div className="mt-8 text-white">
          <h3 className="text-center text-xl mb-4">Completed Groups:</h3>
          <div className="grid gap-4">
            {completedGroups.map((group, index) => {
              const movie = movies.find(m => 
                group.every(actorId => 
                  m.actors.some(a => a.id === actorId)
                )
              );
              return (
                <div key={index} className="bg-element p-4 rounded-lg">
                  <div className="font-bold mb-2">{movie?.title}</div>
                  <div className="grid grid-cols-4 gap-2">
                    {group.map(actorId => {
                      const actor = actors.find(a => a.id === actorId);
                      return (
                        <div key={actorId} className="text-sm">
                          {actor?.name}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Grid;