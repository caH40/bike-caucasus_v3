type Props = {
  params: {
    champName: string;
  };
};

export default function Registration({ params: { champName } }: Props) {
  return <div>{champName}</div>;
}
