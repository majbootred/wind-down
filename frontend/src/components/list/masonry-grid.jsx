import React, { useState } from "react";
import catNames from "cat-names";
import { styles } from "./theme";
import { Masonry } from "masonic";

const MasonryGrid = () => {
  // Constructs the data for our grid items
  const [items] = useState(() =>
    Array.from(Array(10), () => ({
      id: i++,
      name: catNames.random(),
    }))
  );

  return (
    <main className={style("container")}>
      <div className={style("masonic")}>
        <Masonry
          // Provides the data for our grid items
          items={items}
          // Adds 8px of space between the grid cells
          columnGutter={2}
          // Sets the minimum column width to 172px
          columnWidth={100}
          // Pre-renders 5 windows worth of content
          overscanBy={5}
          // This is the grid item component
          render={FakeCard}
        />
      </div>
    </main>
  );
};

const FakeCard = ({ data: { id, name } }) => (
  <div id={id} className={style("card")}>
    <span>{`${name} ${id}`} </span>
  </div>
);

const style = styles({
  masonic: `
      padding: 2px;
      width: 100%;
      max-width: 960px;
      margin: 120px auto 0;
      box-sizing: border-box;
    `,
  container: `
      min-height: 100vh;
      width: 100%;
    `,
  minify: ({ pad, color }) => `
      padding: ${pad.sm};
      background-color: ${color.dark};
      color: ${color.light};
    `,
  card: ({ shadow, color, pad, radius }) => `
      display: flex;
      flex-direction: column;
      background: ${color.dark};
      border-radius: ${radius.lg};
      justify-content: center;
      align-items: center;
      transition: transform 100ms ease-in-out;
      width: 100px;
      height: 100px;

      span:last-of-type {
        color: #fff;
        padding: ${pad.sm};
      }

      &:hover,&:active {
        position: relative;
        background: ${color.light};
        transform:scale(1.25);
        z-index: 1000;
        box-shadow: ${shadow.lg};

        span:last-of-type {
          color: ${color.dark};
          padding: ${pad.sm};
        }
      }
    `,
  img: ({ radius }) => `
      width: 100%;
      display: block;
      border-top-left-radius: ${radius.md};
      border-top-right-radius: ${radius.md};
      display: block;
    `,
});

const randomChoice = (items) => items[Math.floor(Math.random() * items.length)];
let i = 0;

export default MasonryGrid;
