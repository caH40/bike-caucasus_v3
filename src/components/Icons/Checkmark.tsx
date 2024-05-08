import styles from './icons.module.css';

export default function Checkmark({ isCompleted }: { isCompleted: boolean }) {
  return (
    <svg
      className={styles.icon}
      id="input__trek-img"
      width="25"
      height="28"
      viewBox="0 0 25 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.853027 13.7011C4.33691 18.2245 7.71484 22.2968 10.9619 27.4472C14.4922 19.0214 18.1055 10.5663 24.0674 1.40986L22.4609 0.526855C17.4268 6.9335 13.5156 12.9979 10.1172 20.205C7.75391 17.6503 3.93457 14.0351 1.60254 12.1776L0.853027 13.7011Z"
        fill={isCompleted ? '#0ec717' : '#690000'}
      />
    </svg>
  );
}
