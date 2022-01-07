import React from 'react';
import styles from './index.module.css';
const Button = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<'a'>
>((props, ref) => (
  <a {...props} className={styles.button} ref={ref}>
    {props.children}
  </a>
));

export default Button;
