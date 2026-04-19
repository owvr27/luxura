interface LoadingSkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export default function LoadingSkeleton({ 
  className = '', 
  variant = 'text',
  width,
  height,
  lines = 1
}: LoadingSkeletonProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'circular':
        return 'rounded-full';
      case 'rectangular':
        return 'rounded-none';
      case 'rounded':
        return 'rounded-lg';
      case 'text':
      default:
        return 'rounded';
    }
  };

  const baseClasses = `bg-luxury-soft animate-pulse ${getVariantClasses()} ${className}`;
  const style = {
    width: width || (variant === 'text' ? '100%' : '40px'),
    height: height || (variant === 'text' ? '1rem' : '40px'),
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${
              index === lines - 1 ? 'w-3/4' : 'w-full'
            }`}
            style={{
              height: height || '1rem',
            }}
          />
        ))}
      </div>
    );
  }

  return <div className={baseClasses} style={style} />;
}
