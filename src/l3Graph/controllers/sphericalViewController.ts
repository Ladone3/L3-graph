import { Vector2D } from '../models/primitives';
import {
    ViewController,
    ROTATION_DECREASE_SPEED,
    KEY_ROTATION_DECREASE_SPEED,
    ZOOM_STEP_MULTIPLAYER,
    BORDER_OPACITY,
    ZERO_POSITION,
} from './viewController';
import { vector3DToTreeVector3, KEY_CODES, KeyHandler } from '../utils';

import * as _ from 'lodash';
import { DiagramView } from '../views/diagramView';
import { MouseHandler } from '../utils/mouseHandler';

const WHEEL_SPEED = 100;

export class SphericalViewController implements ViewController {
    readonly id: string;
    public label: string;
    protected isActive: boolean;
    protected cameraAngle: Vector2D = { x: 0, y: Math.PI / 4 };
    protected cameraDistance: number = 1000;
    protected startAngle: Vector2D;

    constructor(
        protected view: DiagramView,
        protected mouseHandler: MouseHandler,
        protected keyHandler: KeyHandler,
    ) {
        this.id = _.uniqueId('view-controller-');
        this.label = 'Spherical View Controller';
        this.updateCameraPosition();

        this.keyHandler.on('keyPressed', e => {
            if (this.isActive) {
                this.onKeyPressed(e.data);
            }
        });
        this.mouseHandler.on('paperStartDrag', e => {
            if (this.isActive) {
                this.onMouseDragStart();
                e.data.nativeEvent.stopPropagation();
            }
        });
        this.mouseHandler.on('paperDrag', e => {
            if (this.isActive) {
                this.onMouseDrag(e.data.offset);
                e.data.nativeEvent.stopPropagation();
            }
        });
        this.mouseHandler.on('paperScroll', e => {
            if (this.isActive) {
                this.onMouseWheel(e.data);
                e.data.stopPropagation();
            }
        });
    }

    switchOn() {
        this.isActive = true;
        this.refreshCamera();
    }

    switchOff() {
        this.isActive = false;
    }

    refreshCamera() {
        const {position} = this.view.cameraState;
        const curTreePos = vector3DToTreeVector3(position);
        const distance = curTreePos.distanceTo(ZERO_POSITION);
        this.cameraDistance = this.limitDistance(distance);

        const y = Math.asin(position.y / this.cameraDistance);
        let x = Math.acos(
            position.x / (
                Math.cos(y) * this.cameraDistance
            )
        );

        // Here is a hack, because I don't really like math.
        if (
            Math.round(position.x) !== Math.round(Math.cos(x) * this.cameraDistance * Math.cos(y)) ||
            Math.round(position.z) !== Math.round(Math.sin(x) * this.cameraDistance * Math.cos(y))
        ) {
            x = Math.asin(
                position.z / (
                    Math.cos(y) * this.cameraDistance
                )
            );
        }
        this.cameraAngle = { x, y };
        this.updateCameraPosition();
    }

    focusOn(element: Element) {
        // not implemented
    }

    protected setCameraAngle(anglePoint: Vector2D) {
        this.cameraAngle = {
            x: anglePoint.x % (Math.PI * 2),
            y: Math.max(-Math.PI / 2 + 0.001, Math.min(anglePoint.y, Math.PI / 2 - 0.001)),
        };
        this.updateCameraPosition();
    }

    protected setCameraDistance(distance: number) {
        this.cameraDistance = this.limitDistance(distance);
        this.updateCameraPosition();
    }

    protected updateCameraPosition() {
        const cameraPosition = {
            x: Math.cos(this.cameraAngle.x) * this.cameraDistance * Math.cos(this.cameraAngle.y),
            y: Math.sin(this.cameraAngle.y) * this.cameraDistance,
            z: Math.sin(this.cameraAngle.x) * this.cameraDistance * Math.cos(this.cameraAngle.y),
        };
        this.view.cameraState = {
            position: cameraPosition,
            focusDirection: this.view.scene.position,
        };
    }

    protected limitDistance(distance: number) {
        return Math.min(Math.max(0.001, distance), this.view.screenParameters.FAR / 2 - BORDER_OPACITY);
    }

    private onMouseDragStart() {
        this.startAngle = this.cameraAngle;
    }

    private onMouseDrag(offset: Vector2D) {
        this.setCameraAngle({
            x: this.startAngle.x + offset.x / ROTATION_DECREASE_SPEED,
            y: this.startAngle.y + offset.y / (ROTATION_DECREASE_SPEED * 3),
        });
    }

    private onMouseWheel(event: MouseWheelEvent) {
        const delta = event.deltaY || event.deltaX || event.deltaZ;
        const deltaNorma = delta < 0 ? 1 : -1;
        this.zoom(deltaNorma * WHEEL_SPEED);
    }

    private onKeyPressed(keyMap: Set<number>) {
        const currentAngle = this.cameraAngle;
        let x = 0;
        let y = 0;

        if (keyMap.has(KEY_CODES.LEFT) && !keyMap.has(KEY_CODES.RIGHT)) {
            x = 1;
        } else if (keyMap.has(KEY_CODES.RIGHT) && !keyMap.has(KEY_CODES.LEFT)) {
            x = -1;
        }
        if (keyMap.has(KEY_CODES.DOWN) && !keyMap.has(KEY_CODES.UP)) {
            y = 1;
        } else if (keyMap.has(KEY_CODES.UP) && !keyMap.has(KEY_CODES.DOWN)) {
            y = -1;
        }
        if (keyMap.has(KEY_CODES.MINUS) && !keyMap.has(KEY_CODES.PLUS)) {
            this.zoom(-10);
        } else if (keyMap.has(KEY_CODES.PLUS) && !keyMap.has(KEY_CODES.MINUS)) {
            this.zoom(10);
        }

        this.setCameraAngle({
            x: currentAngle.x + x / KEY_ROTATION_DECREASE_SPEED,
            y: currentAngle.y + y / (KEY_ROTATION_DECREASE_SPEED * 3),
        });
    }

    private zoom(diff: number) {
        const curDistance = this.cameraDistance;
        this.setCameraDistance(
            curDistance - diff * ZOOM_STEP_MULTIPLAYER,
        );
    }
}
