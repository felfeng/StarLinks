import React, { useState } from "react";

interface Actor {
  id: string;
  name: string;
}

interface GridProps {
  actors: Actor[];
  gridSize: number;
}

const Grid: React.FC<GridProps> = ({ actors, gridSize }) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [completedGroups, setCompletedGroups] = useState<string[][]>([]);

  const handleSelect = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((actorId) => actorId !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const handleSubmitGroup = () => {
    if (selected.length === 4) {
      setCompletedGroups([...completedGroups, selected]);
      setSelected([]); // clear selection
    } else {
      alert("Groups must have exactly 4 actors!");
    }
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
            }`}
            onClick={() => handleSelect(actor.id)}
          >
            {actor.name}
          </div>
        ))}
      </div>
      <button
        className="submit-button mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center"
        onClick={handleSubmitGroup}
      >
        Shuffle
      </button>
      <button
        className="submit-button mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center"
        onClick={handleSubmitGroup}
      >
        Submit
      </button>
    </div>
  );
};

export default Grid;
