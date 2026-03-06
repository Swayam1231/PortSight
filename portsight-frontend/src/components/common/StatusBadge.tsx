export default function StatusBadge({ status }: { status: string }) {
  const getBadgeStyle = (status: string) => {
    switch (status.toUpperCase()) {
      case 'ACTIVE':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PROPOSED':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'ON_HOLD':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'COMPLETED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getBadgeStyle(status)}`}>
      {status.replace('_', ' ')}
    </span>
  );
}