import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertTriangle, CheckCircle, Clock, Wifi, WifiOff } from 'lucide-react';
import { DataQualityScore, formatDataAge, getQualityColor, getQualityLabel } from '@/lib/apiHelpers';

interface DataQualityIndicatorProps {
  quality: DataQualityScore;
  timestamp?: number;
  fromCache?: boolean;
  isStale?: boolean;
  source: string;
}

const DataQualityIndicator: React.FC<DataQualityIndicatorProps> = ({
  quality,
  timestamp,
  fromCache = false,
  isStale = false,
  source
}) => {
  const getStatusIcon = () => {
    if (quality.overall >= 4) return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (quality.overall >= 3) return <Clock className="w-4 h-4 text-yellow-600" />;
    return <AlertTriangle className="w-4 h-4 text-red-600" />;
  };

  const getStatusText = () => {
    if (isStale) return "Stale Data";
    if (fromCache) return "Cached";
    return "Live";
  };

  const getStatusColor = () => {
    if (isStale) return "bg-orange-100 text-orange-800";
    if (fromCache) return "bg-blue-100 text-blue-800";
    return "bg-green-100 text-green-800";
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <div className="flex items-center space-x-1">
              <Badge variant="outline" className={`text-xs ${getStatusColor()}`}>
                {getStatusText()}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {getQualityLabel(quality.overall)}
              </Badge>
            </div>
            {fromCache ? (
              <WifiOff className="w-3 h-3 text-gray-400" />
            ) : (
              <Wifi className="w-3 h-3 text-green-500" />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <div className="font-semibold mb-2">Data Quality Report</div>
            <div className="space-y-1">
              <div>Source: {source}</div>
              <div>Freshness: {quality.freshness}/5</div>
              <div>Consistency: {quality.consistency}/5</div>
              <div>Accuracy: {quality.accuracy}/5</div>
              <div className="font-medium">Overall: {quality.overall}/5</div>
              {timestamp && (
                <div>Updated: {formatDataAge(timestamp)}</div>
              )}
              {isStale && (
                <div className="text-orange-600 font-medium">⚠️ Data may be outdated</div>
              )}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default DataQualityIndicator;