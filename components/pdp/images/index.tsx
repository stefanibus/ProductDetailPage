import styles from './index.module.css';

const Image = (variant: {
  variant: { imageurl: string | undefined; formatLabel: string | undefined };
}) => {
  return (
    <div>
      <img
        src={variant.variant.imageurl}
        alt={variant.variant.formatLabel}
        className={styles.img}
      />
    </div>
  );
};
export default Image;
