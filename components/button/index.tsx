import styles from './index.module.css';
import React from 'react';

const Button = React.forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithoutRef<'a'>
>((props, ref) => {
  return (
    // @ts-ignore: Unreachable code error (importing useRef would solve the TS error)
    <a {...props} className={styles.button} ref={ref}>
      {props.children}
    </a>
  );
});
Button.displayName = 'Search';

export default Button;
