declare module 'react-heatmap-grid' {
  import { ComponentType } from 'react';

  export interface HeatMapProps {
    xLabels: string[];
    yLabels: string[];
    data: number[][];
    xLabelsLocation?: 'top' | 'bottom';
    xLabelWidth?: number;
    yLabelWidth?: number;
    cellStyle?: (
      background: string,
      value: number,
      min: number,
      max: number,
      data: number[][],
      x: number,
      y: number
    ) => React.CSSProperties;
    cellRender?: (value: number) => React.ReactNode;
    title?: (value: number, unit: string, index: number) => string;
    height?: number;
    onClick?: (x: number, y: number) => void;
    squares?: boolean;
  }

  const HeatMap: ComponentType<HeatMapProps>;
  export default HeatMap;
}
