export interface Vector3d {
    x: number;
    y: number;
    z: number;
}

export interface Vector2d {
    x: number;
    y: number;
}

export interface Rectangle extends Vector2d {
    width: number;
    height: number;
}

export interface Box extends Vector3d {
    width: number;
    height: number;
    deep: number;
}

export enum Object3dKind {
    Mesh = 'mesh',
    Line = 'line',
}

export type Polygon3d = [Vector3d, Vector3d, Vector3d];
export interface Mesh {
    type: Object3dKind.Mesh;
    polygons: Polygon3d[];
}

export interface Line {
    type: Object3dKind.Line;
    points: Vector3d[];
}
