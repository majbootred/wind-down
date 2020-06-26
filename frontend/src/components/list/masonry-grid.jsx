import React, { useState, useEffect } from "react";
import { styles } from "./theme";
import { Masonry } from "masonic";

const MasonryGrid = (props) => {
  const { listItems, onListChange } = props;

  return (
    <main className={style("container")}>
      <div className={style("masonic")}>
        <Masonry
          // Provides the data for our grid items
          items={listItems}
          // Adds 8px of space between the grid cells
          columnGutter={2}
          // Sets the minimum column width to 172px
          columnWidth={120}
          // Pre-renders 5 windows worth of content
          overscanBy={5}
          // This is the grid item component
          render={Card}
        />
      </div>
    </main>
  );
};

const Card = ({ data: { name } }) => (
  <div className={style("card")}>
    <span>{name}</span>
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
