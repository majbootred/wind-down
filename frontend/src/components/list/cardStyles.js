import { styles } from './theme'

export default styles({
  minify: ({ pad, color }) => `
        padding: ${pad.sm};
        background-color: ${color.dark};
        color: ${color.light};
      `,
  card: ({ shadow, color, pad, radius }) => `
        display: flex;
        flex-direction: column;
        border-radius: ${radius.sm};
        justify-content: center;
        align-items: center;
        transition: transform 100ms ease-in-out;
        width: 80px;
        height: 80px;

        span:last-of-type {
          color: #fff;
          padding: ${pad.sm};
        }

        &:hover,&:active {
          position: relative;
          transform:scale(1.25);
          z-index: 1000;
          box-shadow: ${shadow.lg};

          span:last-of-type {
            padding: ${pad.sm};
          }
        }
      `,
})
