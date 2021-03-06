import * as React from 'react';
import { ReactOverlay } from '.';

class DefaultLinkOverlayClass extends React.Component<{label: string}> {
    render() {
        const {label} = this.props;
        return <div className='l3graph-link-html-view'>
            {label}
        </div>;
    }
}

class DefaultNodeOverlayClass extends React.Component<{label: string}> {
    render() {
        const {label} = this.props;
        return <div className='l3graph-default-node-view'>
            {label}
        </div>;
    }
}

export const DEFAULT_LINK_OVERLAY: ReactOverlay = {id: 'link-overlay', value: <DefaultLinkOverlayClass label=''/>};
export const DEFAULT_NODE_OVERLAY: ReactOverlay = {id: 'node-overlay', value: <DefaultNodeOverlayClass label=''/>};

export function createContextProvider(context: any): React.ComponentClass {
    class ContextProvider extends React.Component {
        public static childContextTypes: any;
        getChildContext() {
            return context;
        }
        render() {
            return <div>{this.props.children}</div>;
        }
    }
    ContextProvider.childContextTypes = {};
    Object.keys(context).forEach(key => {
        ContextProvider.childContextTypes[key] = React.PropTypes.any.isRequired;
    });
    return ContextProvider;
}

export function enrichOverlay<Data>(
    pooreOverlay: ReactOverlay<Data>,
    data: Data,
): ReactOverlay<Data> {
    const overlayProps: Data = {
        ...pooreOverlay.value.props as any,
        ...data as any,
    };

    return {
        ...pooreOverlay,
        value: React.cloneElement(pooreOverlay.value, overlayProps),
    };
}
