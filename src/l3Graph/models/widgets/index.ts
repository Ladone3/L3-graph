import * as _ from 'lodash';
import { MouseHandler } from '../../utils/mouseHandler';
import { KeyHandler } from '../../utils';
import { DiagramWidgetView, GraphView } from '../../views';
import { DiagramModel } from '../diagramModel';
import { Widget } from './widget';

export const DEFAULT_SELECTION_TYPE_ID = 'l3graph-selection';

export interface WidgetModelContext {
    diagramModel: DiagramModel;
    keyHandler: KeyHandler;
    mouseHandler: MouseHandler;
}

export interface WidgetViewContext {
    graphView: GraphView;
    widget: Widget;
}

export type WidgetModelResolver = (context: WidgetModelContext) => Widget;
export type WidgetViewResolver = (context: WidgetViewContext) => DiagramWidgetView;

export interface WidgetFabric {
    model: WidgetModelResolver;
    view: WidgetViewResolver;
}

export * from './widget';
export * from './arrowHelper';
export * from './nodeWidget';
export * from './reactNodeWidget';
export * from './selectionWidget';
export * from './widgetsModel';