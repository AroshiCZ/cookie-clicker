type UpgradeCardProps = {
  title: string;
  description: string;
  cost: number;
  count: number;
  onBuy: () => void;
  disabled: boolean;
};

export default function UpgradeCard({
  title,
  description,
  cost,
  count,
  onBuy,
  disabled,
}: UpgradeCardProps) {
  return (
    <button className="upgrade-card" onClick={onBuy} disabled={disabled}>
      <div>
        <strong>{title} {count}</strong>
        <p>{description}</p>
        {/* <small>Owned: {count}</small> */}
      </div>
      <span>{cost.toLocaleString()} cookies</span>
    </button>
  );
}
