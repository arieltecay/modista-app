export interface ErrorCardProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
}
